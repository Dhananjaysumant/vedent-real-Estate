import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { config } from './config';
import { apiLimiter } from './middleware/rateLimits';
import { conciergeRouter } from './routes/concierge';
import { enquiriesRouter } from './routes/enquiries';
import { isGeminiConfigured } from './services/gemini';
import { originGuard, securityHeaders } from './security/headers';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', config.trustProxy);

app.use(securityHeaders);
app.use(express.json({ limit: '24kb', strict: true, type: 'application/json' }));
app.use('/api', originGuard);
app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'vanguard-estates',
    demo: true,
    aiConfigured: isGeminiConfigured(),
    storage: 'server-side JSONL',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/concierge', conciergeRouter);
app.use('/api/enquiries', enquiriesRouter);
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'not_found', message: 'Unknown API endpoint.' });
});

const indexHtml = path.join(config.distDir, 'index.html');
const hasBuild = config.isProduction && fs.existsSync(indexHtml);

if (hasBuild) {
  app.use(
    express.static(config.distDir, {
      index: false,
      etag: true,
      maxAge: '1h',
      setHeaders: (res, filePath) => {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        } else if (/\.(svg|png|jpg|jpeg|webp|woff2?|mp4)$/i.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=86400');
        }
      },
    }),
  );

  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();
      return;
    }
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }
    if (!req.accepts('html')) {
      next();
      return;
    }
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(indexHtml);
  });
} else {
  app.get('/', (_req, res) => {
    res.type('text/plain').send(
      'Vanguard Estates API is running. Start the Vite development client with `npm run dev`, or build with `npm run build` then run `npm start`.',
    );
  });
}

app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'not_found', message: 'Unknown API endpoint.' });
    return;
  }
  res.status(404).type('text/plain').send('Not found');
});

app.use(
  (
    error: unknown,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    if (res.headersSent) {
      next(error);
      return;
    }

    const status =
      typeof error === 'object' && error !== null && 'status' in error
        ? Number((error as { status?: number }).status) || 500
        : 500;

    if (status === 413) {
      res.status(413).json({
        error: 'payload_too_large',
        message: 'That request is too large. Please shorten your message and try again.',
      });
      return;
    }

    if (status === 400) {
      res.status(400).json({
        error: 'malformed_request',
        message: 'The request could not be read. Please check the data and try again.',
      });
      return;
    }

    if (status >= 500) {
      const message = error instanceof Error ? error.message : 'Unknown server error';
      console.error(`[server] ${req.method} ${req.path} failed: ${message.slice(0, 200)}`);
    }

    res.status(500).json({
      error: 'server_error',
      message: 'An unexpected error occurred. Please try again shortly.',
    });
  },
);

const server = app.listen(config.port, () => {
  console.log(
    `[vanguard] API listening on http://localhost:${config.port} (${config.isProduction ? 'production' : 'development'})`,
  );
  console.log(`[vanguard] Gemini concierge: ${isGeminiConfigured() ? 'configured' : 'knowledge-base fallback'}`);
  if (hasBuild) console.log('[vanguard] Serving compiled client from dist/');
});

server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;

function shutdown(signal: string) {
  console.log(`[vanguard] ${signal} received; closing server.`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
