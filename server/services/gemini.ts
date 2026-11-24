import { GoogleGenAI } from '@google/genai';
import { config } from '../config';
import { SYSTEM_INSTRUCTION, sanitizeOutput } from './knowledge';

let client: GoogleGenAI | null = null;

export function isGeminiConfigured(): boolean {
  return config.geminiApiKey.length > 0;
}

function getClient(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }
  return client;
}

export async function askGemini(
  messages: { role: 'user' | 'assistant'; content: string }[],
): Promise<string> {
  if (!isGeminiConfigured()) throw new Error('AI service is not configured.');

  const contents = messages.map((message) => ({
    role: message.role === 'assistant' ? ('model' as const) : ('user' as const),
    parts: [{ text: message.content }],
  }));

  const request = getClient().models.generateContent({
    model: config.geminiModel,
    contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.45,
      topP: 0.9,
      maxOutputTokens: 520,
    },
  });

  let timer: NodeJS.Timeout | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error('AI request timed out.')), 20_000);
  });

  try {
    const response = await Promise.race([request, timeout]);
    const text = response.text?.trim();
    if (!text) throw new Error('Empty AI response.');
    return sanitizeOutput(text);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

