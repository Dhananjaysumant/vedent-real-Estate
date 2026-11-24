import { z } from 'zod';

const phonePattern = /^[+\d().\s-]{6,32}$/;

export const conciergeMessageSchema = z
  .object({
    role: z.enum(['user', 'assistant']),
    content: z.string().trim().min(1).max(800),
  })
  .strict();

export const conciergeRequestSchema = z
  .object({
    sessionId: z
      .string()
      .trim()
      .min(8)
      .max(80)
      .regex(/^[a-zA-Z0-9_-]+$/),
    messages: z.array(conciergeMessageSchema).min(1).max(8),
  })
  .strict();

export const enquiryRequestSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().min(5).max(200).email(),
    phone: z
      .string()
      .trim()
      .max(32)
      .optional()
      .refine((value) => !value || phonePattern.test(value), 'Invalid telephone number.'),
    propertySlug: z.string().trim().max(100).optional(),
    preferredDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date.')
      .optional(),
    contactMethod: z.enum(['email', 'phone']),
    message: z.string().trim().max(1200).optional(),
    consent: z.literal(true),
    company: z.string().max(0).optional(),
    elapsedMs: z.number().int().min(0).max(3_600_000).optional(),
    source: z.string().trim().max(60).optional(),
  })
  .strict();

export type ConciergeRequest = z.infer<typeof conciergeRequestSchema>;
export type EnquiryRequest = z.infer<typeof enquiryRequestSchema>;
