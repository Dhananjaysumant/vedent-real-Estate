import 'dotenv/config';
import crypto from 'node:crypto';
import path from 'node:path';

const dev = process.argv.includes('--dev') || process.env.NODE_ENV === 'development';

function parsePort(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? '8787', 10);
  if (!Number.isFinite(parsed) || parsed < 1 || parsed > 65535) return 8787;
  return parsed;
}

function parseOrigins(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => /^https?:\/\/[a-z0-9.:-]+$/i.test(entry));
}

export const config = {
  dev,
  port: parsePort(process.env.PORT),
  geminiApiKey: (process.env.GEMINI_API_KEY ?? '').trim(),
  geminiModel: (process.env.GEMINI_MODEL ?? 'gemini-2.5-flash').trim(),
  trustProxy: process.env.TRUST_PROXY === '1' || process.env.TRUST_PROXY === 'true',
  allowedOrigins: parseOrigins(process.env.ALLOWED_ORIGIN),
  storePath: path.resolve(process.cwd(), process.env.ENQUIRY_STORE_PATH ?? 'server/data/enquiries.jsonl'),
  ipSalt:
    (process.env.ENQUIRY_IP_SALT ?? '').trim() || crypto.randomBytes(24).toString('hex'),
  publicDir: path.resolve(process.cwd(), 'public'),
  distDir: path.resolve(process.cwd(), 'dist'),
  isProduction: !dev,
} as const;

export function hashIp(ip: string | undefined): string {
  if (!ip) return 'unknown';
  return crypto.createHash('sha256').update(`${config.ipSalt}:${ip}`).digest('hex').slice(0, 24);
}
