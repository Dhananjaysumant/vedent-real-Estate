import rateLimit from 'express-rate-limit';

const message = {
  error: 'rate_limited',
  message: 'Too many requests. Please wait a little while before trying again.',
};

const shared = {
  standardHeaders: 'draft-8' as const,
  legacyHeaders: false,
  message,
};

export const apiLimiter = rateLimit({
  ...shared,
  windowMs: 60_000,
  limit: 90,
});

export const conciergeLimiter = rateLimit({
  ...shared,
  windowMs: 60_000,
  limit: 8,
});

export const conciergeHourlyLimiter = rateLimit({
  ...shared,
  windowMs: 60 * 60_000,
  limit: 45,
});

export const enquiryLimiter = rateLimit({
  ...shared,
  windowMs: 60 * 60_000,
  limit: 8,
  message: {
    error: 'rate_limited',
    message:
      'This address has reached its enquiry limit for now. Please try again later or email us directly.',
  },
});
