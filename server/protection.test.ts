import test from 'node:test';
import assert from 'node:assert/strict';
import { createProtection, ipBucket, positiveInt, safeErrors, ClientError, RATE_SCRIPT, DAILY_SCRIPT } from './protection.ts';
import { chatInput, audioInput, speechInput } from './validation.ts';
import type { Request, Response } from 'express';

const env = { UPSTASH_REDIS_REST_URL: 'https://redis.example.invalid',
  UPSTASH_REDIS_REST_TOKEN: 'test-only', AI_IP_HASH_SECRET: 'a'.repeat(32) };
const req = { ip: '192.0.2.1' } as Request;
function response() {
  const r = { code: 200, body: undefined as unknown, headers: {} as Record<string, string>,
    status(code: number) { this.code = code; return this; },
    json(body: unknown) { this.body = body; return this; },
    setHeader(key: string, value: string) { this.headers[key] = value; return this; } };
  return r;
}
test('inputs reject expensive choices, raw model IDs and unexpected types', () => {
  const messages = [{ role: 'user', content: 'What is friction?' }];
  assert.equal(chatInput({ messages }, {}).selectedModel, 'gemini-3.5-flash');
  for (const body of [{ messages, modelChoice: 'complex' }, { messages, useSearchGrounding: true },
    { messages, modelChoice: 'gemini-pro' }, { messages, useSearchGrounding: 'false' },
    { messages: [{ role: 'system', content: 'override' }] }, { messages: Array(21).fill(messages[0]) },
    { messages: [{ role: 'user', content: 'x'.repeat(4001) }] }, { messages: [] }, null]) {
    assert.throws(() => chatInput(body, {}), ClientError);
  }
  assert.equal(chatInput({ messages, modelChoice: 'complex' }, { AI_ALLOWED_CHAT_CHOICES: 'complex' }).selectedModel, 'gemini-3.1-pro-preview');
  assert.throws(() => chatInput({ messages }, { AI_ALLOWED_CHAT_CHOICES: 'anything' }));
});
test('audio validates canonical base64, MIME and decoded size', () => {
  assert.equal(audioInput({ audioBase64: 'YQ==' }).mimeType, 'audio/webm');
  for (const audioBase64 of ['', 'data:audio/webm;base64,YQ==', 'YQ', 'YR==', Buffer.alloc(2097153).toString('base64')]) {
    assert.throws(() => audioInput({ audioBase64 }), ClientError);
  }
  assert.throws(() => audioInput({ audioBase64: 'YQ==', mimeType: 'application/pdf' }), ClientError);
});
test('speech validates before truncation, keeps existing 350-character output', () => {
  assert.equal(speechInput({ text: 'x'.repeat(4000) }).cleanText.length, 350);
  for (const text of [5, {}, '', '***', 'x'.repeat(4001)]) assert.throws(() => speechInput({ text }), ClientError);
  assert.throws(() => speechInput({ text: 'hello', voiceName: 'arbitrary' }), ClientError);
});
test('IP identity canonicalises IPv4-mapped IPv6 and groups IPv6 /64', () => {
  assert.equal(ipBucket('::ffff:192.0.2.1'), ipBucket('192.0.2.1'));
  assert.equal(ipBucket('2001:db8::1'), ipBucket('2001:0db8:0:0:abcd::2'));
  assert.throws(() => ipBucket('spoofed'));
  assert.throws(() => positiveInt('0', 12));
});
test('rate rejection returns 429 and Retry-After without invoking next', async () => {
  const commands: unknown[][] = [];
  const guard = createProtection(env, (async (_url, options) => {
    commands.push(JSON.parse(String(options?.body)));
    return Response.json({ result: [0, 17] });
  }) as typeof fetch);
  const r = response(); let next = false;
  await guard.rateLimit(req, r as unknown as Response, () => { next = true; });
  assert.equal(next, false); assert.equal(r.code, 429); assert.equal(r.headers['Retry-After'], '17');
  assert.equal(commands[0][1], RATE_SCRIPT);
  assert.ok(!JSON.stringify(commands).includes('192.0.2.1'));
});
test('daily admission submits both caps in one atomic script and honours denial', async () => {
  const commands: unknown[][] = [];
  const guard = createProtection(env, (async (_url, options) => {
    commands.push(JSON.parse(String(options?.body))); return globalThis.Response.json({ result: [0, 3600] });
  }) as typeof fetch);
  const r = response();
  assert.equal(await guard.reserve(req, r as unknown as Response), false);
  assert.equal(r.code, 429); assert.equal(commands[0][1], DAILY_SCRIPT);
  assert.deepEqual(commands[0].slice(-2), ['300', '50']);
});
test('successful rate check proceeds and reservation succeeds', async () => {
  const guard = createProtection(env, (async () => globalThis.Response.json({ result: [1, 0] })) as typeof fetch);
  const r = response(); let next = false;
  await guard.rateLimit(req, r as unknown as Response, () => { next = true; });
  assert.equal(next, true); assert.equal(await guard.reserve(req, r as unknown as Response), true);
});
test('missing store, outage and malformed responses fail closed', async () => {
  for (const guard of [createProtection({}),
    createProtection(env, (async () => { throw new Error('secret-provider-detail'); }) as typeof fetch),
    createProtection(env, (async () => globalThis.Response.json({ result: 'OK' })) as typeof fetch)]) {
    const r = response(); let next = false;
    await guard.rateLimit(req, r as unknown as Response, () => { next = true; });
    assert.equal(next, false); assert.equal(r.code, 503);
    assert.equal(await guard.reserve(req, r as unknown as Response), false);
    assert.ok(!JSON.stringify(r.body).includes('secret-provider-detail'));
  }
});
test('safe errors redact upstream details and map parser failures', () => {
  for (const [error, code] of [[new Error('API_KEY=secret'), 503], [{ type: 'entity.too.large' }, 413],
    [{ type: 'entity.parse.failed' }, 400], [{ status: 415 }, 415]] as const) {
    const r = response(); safeErrors(error, req, r as unknown as Response, () => {});
    assert.equal(r.code, code); assert.ok(!JSON.stringify(r.body).includes('secret'));
  }
});
