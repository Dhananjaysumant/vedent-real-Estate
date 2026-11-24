import { Router } from 'express';
import { conciergeHourlyLimiter, conciergeLimiter } from '../middleware/rateLimits';
import { askGemini, isGeminiConfigured } from '../services/gemini';
import {
  fallbackAnswer,
  looksLikePromptInjection,
  refusalForInjection,
} from '../services/knowledge';
import { conciergeRequestSchema } from '../validation/schemas';

export const conciergeRouter = Router();

conciergeRouter.post('/', conciergeLimiter, conciergeHourlyLimiter, async (req, res) => {
  const parsed = conciergeRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'invalid_request',
      message:
        'The concierge could not read that message. Please keep it under 800 characters and try again.',
    });
    return;
  }

  const messages = parsed.data.messages;
  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') {
    res.status(400).json({
      error: 'invalid_request',
      message: 'The last message must be a question from you.',
    });
    return;
  }

  if (looksLikePromptInjection(last.content)) {
    res.setHeader('Cache-Control', 'no-store');
    res.json({
      reply: refusalForInjection(),
      source: 'knowledge-base',
      suggestViewing: false,
      limited: true,
    });
    return;
  }

  const viewingIntent = /(viewing|visit|appointment|arrange|tour|consultation|book)/i.test(
    last.content,
  );

  let reply = '';
  let source: 'gemini' | 'knowledge-base' = 'knowledge-base';
  let suggestViewing = false;
  let limited = false;

  if (isGeminiConfigured()) {
    try {
      reply = await askGemini(messages);
      source = 'gemini';
      suggestViewing =
        viewingIntent || /(private viewing|viewing form|request a viewing)/i.test(reply);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown AI error';
      console.warn(`[concierge] Gemini unavailable; using knowledge base. ${message.slice(0, 160)}`);
    }
  }

  if (!reply) {
    const fallback = fallbackAnswer(last.content);
    reply = fallback.reply;
    suggestViewing = fallback.suggestViewing || viewingIntent;
    limited = fallback.limited;
    source = 'knowledge-base';
  }

  // Defence in depth: never return text that appears to disclose internal configuration.
  if (/(system instruction|api\s*key|environment variable|process\.env|server code)/i.test(reply)) {
    reply = refusalForInjection();
    source = 'knowledge-base';
    limited = true;
    suggestViewing = false;
  }

  res.setHeader('Cache-Control', 'no-store');
  res.json({
    reply: reply.slice(0, 1800),
    source,
    suggestViewing,
    limited,
  });
});
