// Local dev entry-point — imports the app and calls listen()
import app from './app';
import { config } from './config';
import { isGeminiConfigured } from './services/gemini';
import path from 'node:path';
import fs from 'node:fs';

const indexHtml = path.join(config.distDir, 'index.html');
const hasBuild = config.isProduction && fs.existsSync(indexHtml);

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
