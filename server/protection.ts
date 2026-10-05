import { createHmac } from 'node:crypto';
import { isIP } from 'node:net';
import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export class ClientError extends Error {
  status: number;
  constructor(status: number, message: string) { super(message); this.status = status; }
}
export function positiveInt(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) {
    throw new Error('Usage limits must be positive integers');
  }
  return Number(value);
}
export function ipBucket(ip: string): string {
  if (ip.startsWith('::ffff:') && isIP(ip.slice(7)) === 4) ip = ip.slice(7);
  if (isIP(ip) === 4) return ip;
  if (isIP(ip) !== 6) throw new Error('Invalid client IP');
  if (ip.includes('.')) {
    const lastColon = ip.lastIndexOf(':');
    const octets = ip.slice(lastColon + 1).split('.').map(Number);
    ip = ip.slice(0, lastColon + 1) + ((octets[0] << 8) | octets[1]).toString(16) + ':' +
      ((octets[2] << 8) | octets[3]).toString(16);
  }
  // Group IPv6 clients by /64 so rotating the interface address cannot evade limits.
  const [left, right] = ip.toLowerCase().split('::');
  const a = left ? left.split(':') : [];
  const b = right ? right.split(':') : [];
  const parts = right === undefined ? a : [...a, ...Array(8 - a.length - b.length).fill('0'), ...b];
  return parts.slice(0, 4).map(p => Number.parseInt(p, 16).toString(16)).join(':') + '::/64';
}

// TIME is evaluated inside Redis: all instances use one clock and UTC day.
export const RATE_SCRIPT = `
local count = tonumber(redis.call('GET', KEYS[1]) or '0')
if count >= tonumber(ARGV[1]) then return {0, math.max(1, redis.call('TTL', KEYS[1]))} end
count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], 60) end
return {1, 0}`;
export const DAILY_SCRIPT = `
local now = tonumber(redis.call('TIME')[1])
local day = math.floor(now / 86400)
local retry = 86400 - (now % 86400)
local function current(key)
  if tonumber(redis.call('HGET', key, 'day') or '-1') ~= day then return 0 end
  return tonumber(redis.call('HGET', key, 'count') or '0')
end
if current(KEYS[1]) >= tonumber(ARGV[1]) or current(KEYS[2]) >= tonumber(ARGV[2]) then
  return {0, retry}
end
for _, key in ipairs(KEYS) do
  local count = current(key) + 1
  redis.call('HSET', key, 'day', day, 'count', count)
  redis.call('EXPIRE', key, retry + 60)
end
return {1, 0}`;

export function createProtection(env: NodeJS.ProcessEnv = process.env, fetcher = fetch) {
  const rate = positiveInt(env.AI_REQUESTS_PER_MINUTE, 12);
  const daily = positiveInt(env.AI_DAILY_REQUEST_CAP, 300);
  const ipDaily = positiveInt(env.AI_IP_DAILY_REQUEST_CAP, 50);
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;
  const secret = env.AI_IP_HASH_SECRET;
  const prefix = env.AI_USAGE_NAMESPACE || 'sciquest:ai';
  if (url && new URL(url).protocol !== 'https:') throw new Error('Redis URL must use HTTPS');
  if (!/^[a-zA-Z0-9:_-]{1,80}$/.test(prefix)) throw new Error('Invalid usage namespace');
  async function evalScript(script: string, keys: string[], args: number[]) {
    if (!url || !token || !secret || secret.length < 32) throw new Error('Usage protection is unconfigured');
    const response = await fetcher(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(['EVAL', script, keys.length, ...keys, ...args.map(String)]),
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) throw new Error('Usage store unavailable');
    const body = await response.json() as { result?: unknown; error?: unknown };
    if (body.error || !Array.isArray(body.result) || body.result.length !== 2 ||
        ![0, 1].includes(body.result[0]) || !Number.isFinite(body.result[1])) {
      throw new Error('Invalid usage store response');
    }
    return body.result as [number, number];
  }
  function identity(req: Request) {
    if (!secret) throw new Error('Usage protection is unconfigured');
    return createHmac('sha256', secret).update(ipBucket(req.ip || '')).digest('hex');
  }
  function rejected(res: Response, retry: number) {
    res.setHeader('Retry-After', String(Math.max(1, Math.ceil(retry))));
    res.status(429).json({ error: 'Science mentor usage limit reached. Please try again later.', useFallback: true });
  }
  return {
    rateLimit: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const [allowed, retry] = await evalScript(RATE_SCRIPT, [`${prefix}:rate:${identity(req)}`], [rate]);
        if (!allowed) return rejected(res, retry);
        next();
      } catch { res.status(503).json({ error: 'Science mentor is temporarily unavailable.', useFallback: true }); }
    },
    reserve: async (req: Request, res: Response): Promise<boolean> => {
      try {
        const [allowed, retry] = await evalScript(DAILY_SCRIPT,
          [`${prefix}:daily:global`, `${prefix}:daily:${identity(req)}`], [daily, ipDaily]);
        if (!allowed) { rejected(res, retry); return false; }
        return true;
      } catch { res.status(503).json({ error: 'Science mentor is temporarily unavailable.', useFallback: true }); return false; }
    },
  };
}

export const safeErrors: ErrorRequestHandler = (error, _req, res, _next) => {
  const status = error instanceof ClientError ? error.status :
    error?.type === 'entity.too.large' ? 413 :
    error?.type === 'entity.parse.failed' ? 400 :
    error?.status === 415 ? 415 : 503;
  // Never log bodies, student audio, prompts, keys, or raw provider exceptions.
  if (status === 503) console.warn('Science mentor request failed');
  res.status(status).json({ error: error instanceof ClientError ? error.message :
    status === 413 ? 'Request is too large.' :
    status === 400 ? 'Invalid JSON request.' :
    status === 415 ? 'Send an uncompressed application/json request.' :
    'Science mentor is temporarily unavailable.', useFallback: true });
};
