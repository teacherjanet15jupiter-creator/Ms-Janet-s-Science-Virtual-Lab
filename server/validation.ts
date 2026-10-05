import { ClientError } from './protection.ts';

const bad = (message: string): never => { throw new ClientError(400, message); };
function object(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return bad('Invalid request body.');
  return body as Record<string, unknown>;
}
export const CHAT_MODELS = {
  fast: 'gemini-3.1-flash-lite',
  standard: 'gemini-3.5-flash',
  complex: 'gemini-3.1-pro-preview',
} as const;
export const TRANSCRIBE_MODEL = 'gemini-3.5-transcribe';
export const SPEECH_MODEL = 'gemini-3.8-flash-lite-tts';

export function chatInput(body: unknown, env: NodeJS.ProcessEnv = process.env) {
  const b = object(body);
  const choice = b.modelChoice ?? 'standard';
  if (typeof choice !== 'string' || !Object.hasOwn(CHAT_MODELS, choice)) return bad('Invalid model choice.');
  const allowed = (env.AI_ALLOWED_CHAT_CHOICES ?? 'fast,standard').split(',').map(v => v.trim());
  if (!allowed.length || allowed.some(v => !Object.hasOwn(CHAT_MODELS, v))) throw new Error('Invalid chat model allowlist');
  if (!allowed.includes(choice)) throw new ClientError(403, 'This model is unavailable during testing.');
  if (b.useSearchGrounding !== undefined && typeof b.useSearchGrounding !== 'boolean') return bad('Invalid search option.');
  if (b.useSearchGrounding && env.AI_ALLOW_SEARCH_GROUNDING !== 'true') {
    throw new ClientError(403, 'Search grounding is unavailable during testing.');
  }
  if (!Array.isArray(b.messages) || b.messages.length < 1 || b.messages.length > 20) return bad('Send 1–20 messages.');
  let total = 0;
  const messages = b.messages.map(item => {
    const m = object(item);
    if (!['user', 'student', 'mentor', 'assistant', 'model'].includes(String(m.role)) ||
        typeof m.content !== 'string' || !m.content.trim() || m.content.length > 4000) return bad('Invalid message.');
    total += m.content.length;
    return { role: String(m.role), content: m.content };
  });
  if (total > 16000) return bad('Chat history is too long. Start a new conversation.');
  return { messages, useSearchGrounding: b.useSearchGrounding === true,
    selectedModel: CHAT_MODELS[choice as keyof typeof CHAT_MODELS] };
}
export function audioInput(body: unknown) {
  const b = object(body);
  const mimeType = b.mimeType ?? 'audio/webm';
  if (!['audio/webm', 'audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/mp4'].includes(String(mimeType))) return bad('Unsupported audio type.');
  if (typeof b.audioBase64 !== 'string' || !b.audioBase64.length || b.audioBase64.length > 2796204 ||
      !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(b.audioBase64)) return bad('Invalid base64 audio.');
  const decoded = Buffer.from(b.audioBase64, 'base64');
  if (!decoded.length || decoded.length > 2 * 1024 * 1024 || decoded.toString('base64') !== b.audioBase64) return bad('Audio must be at most 2 MiB.');
  return { audioBase64: b.audioBase64, mimeType: String(mimeType) };
}
export function speechInput(body: unknown) {
  const b = object(body);
  if (typeof b.text !== 'string' || !b.text.trim() || b.text.length > 4000) return bad('Speech text must contain 1–4000 characters.');
  if (b.voiceName !== undefined && b.voiceName !== 'Puck') return bad('Unsupported voice.');
  const cleanText = b.text.replace(/[*#_`]/g, '').slice(0, 350);
  if (!cleanText.trim()) return bad('Speech text is empty.');
  return { cleanText, voiceName: 'Puck' };
}
