import { Router } from 'express';
import { properties } from '../../src/data/properties';
import { hashIp } from '../config';
import { enquiryLimiter } from '../middleware/rateLimits';
import { saveEnquiry } from '../services/enquiryStore';
import { enquiryRequestSchema, type EnquiryRequest } from '../validation/schemas';

export const enquiriesRouter = Router();

const VALID_PROPERTY_SLUGS = new Set(properties.map((property) => property.slug));

function cleanText(value: string): string {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
}

function normaliseSource(value: string | undefined): string {
  if (!value) return 'website';
  return /^[a-zA-Z0-9-]{1,60}$/.test(value) ? value : 'website';
}

function isPastDate(value: string): boolean {
  const chosen = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(chosen.getTime())) return true;
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 12);
  return chosen.getTime() < todayUtc;
}

enquiriesRouter.post('/', enquiryLimiter, async (req, res) => {
  const parsed = enquiryRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !fields[key]) {
        fields[key] = issue.message;
      }
    }
    res.status(400).json({
      error: 'validation_failed',
      message: 'Please review the highlighted fields and try again.',
      fields,
    });
    return;
  }

  const data = parsed.data;

  // Honeypot and minimum completion time are spam heuristics, not security boundaries.
  if (data.company || (data.elapsedMs !== undefined && data.elapsedMs < 1800)) {
    res.status(400).json({
      error: 'request_rejected',
      message: 'We could not verify this request. Please reload the page and try again.',
    });
    return;
  }

  if (data.contactMethod === 'phone' && (!data.phone || data.phone.replace(/\D/g, '').length < 6)) {
    res.status(400).json({
      error: 'validation_failed',
      message: 'Please add a telephone number for telephone contact.',
      fields: { phone: 'A telephone number is required for telephone contact.' },
    });
    return;
  }

  if (data.propertySlug && !VALID_PROPERTY_SLUGS.has(data.propertySlug)) {
    res.status(400).json({
      error: 'validation_failed',
      message: 'Please choose a listed residence, or no preference.',
      fields: { propertySlug: 'Unknown residence.' },
    });
    return;
  }

  if (data.preferredDate && isPastDate(data.preferredDate)) {
    res.status(400).json({
      error: 'validation_failed',
      message: 'Please choose today or a future date.',
      fields: { preferredDate: 'Please choose today or a future date.' },
    });
    return;
  }

  const sanitised: EnquiryRequest = {
    name: cleanText(data.name),
    email: cleanText(data.email),
    phone: data.phone ? cleanText(data.phone) : undefined,
    propertySlug: data.propertySlug || undefined,
    preferredDate: data.preferredDate || undefined,
    contactMethod: data.contactMethod,
    message: data.message ? cleanText(data.message) : undefined,
    consent: true,
    source: normaliseSource(data.source),
  };

  try {
    const result = await saveEnquiry(sanitised, {
      ipHash: hashIp(req.ip),
      source: sanitised.source ?? 'website',
    });

    res.status(201).json({
      ok: true,
      reference: result.reference,
      receivedAt: result.receivedAt,
      message:
        'Your request has been received. This is not a confirmed appointment; a specialist would respond to agree a time.',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown store error';
    console.error(`[enquiries] Could not persist request: ${message.slice(0, 180)}`);
    res.status(503).json({
      error: 'storage_unavailable',
      message:
        'Your request could not be saved just now. Please try again shortly, or contact us by email.',
    });
  }
});
