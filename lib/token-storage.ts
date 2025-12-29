import crypto from 'crypto';
import { Redis } from '@upstash/redis';

const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
  throw new Error('TOKEN_ENCRYPTION_KEY environment variable is required');
}

// Initialize Redis client
// Supports both Upstash env vars and Vercel KV env vars
const redis = (() => {
  // Try Upstash env vars first
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  // Fall back to Vercel KV env vars (compatible API)
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  }
  // Try fromEnv (Upstash default)
  try {
    return Redis.fromEnv();
  } catch {
    throw new Error('Redis configuration missing. Set UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or KV_REST_API_URL/KV_REST_API_TOKEN');
  }
})();

// Simple encrypt/decrypt (with random salt)
function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(ENCRYPTION_KEY!, salt, 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + salt.toString('hex') + ':' + encrypted;
}

function decrypt(encrypted: string): string {
  const [ivHex, saltHex, encryptedText] = encrypted.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const salt = Buffer.from(saltHex, 'hex');
  const key = crypto.scryptSync(ENCRYPTION_KEY!, salt, 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export async function saveTokens(tokens: any): Promise<void> {
  await redis.set('google_tokens', encrypt(JSON.stringify(tokens)));
}

export async function readTokens(): Promise<any | null> {
  try {
    const encrypted = await redis.get<string>('google_tokens');
    if (!encrypted) return null;
    return JSON.parse(decrypt(encrypted));
  } catch {
    return null;
  }
}

export async function deleteTokens(): Promise<void> {
  await redis.del('google_tokens');
}

// Config storage (same approach)
export interface FormConfig {
  sheetId: string;
  ownerEmail: string;
  sheetName?: string;
}

export async function saveConfig(config: Partial<FormConfig>): Promise<void> {
  const existing = await readConfig();
  // Merge new config over existing (new values take precedence)
  const merged: Partial<FormConfig> = { ...existing, ...config };
  // Remove null/undefined values to keep config clean
  const cleaned: Partial<FormConfig> = Object.fromEntries(
    Object.entries(merged).filter(([_, v]) => v != null)
  );
  await redis.set('form_config', JSON.stringify(cleaned));
}

export async function readConfig(): Promise<FormConfig | null> {
  try {
    const config = await redis.get<FormConfig | string>('form_config');
    if (!config) return null;
    // Upstash may return already parsed JSON or a string
    if (typeof config === 'string') {
      return JSON.parse(config);
    }
    return config as FormConfig;
  } catch (error) {
    console.error('Error reading config:', error);
    return null;
  }
}
