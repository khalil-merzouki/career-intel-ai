import 'dotenv/config';
import { serve } from '@hono/node-server';
import { createApp } from './app.js';

const token = process.env.EXTRACTOR_TOKEN;
if (!token || !process.env.OPENAI_API_KEY || !process.env.OPENAI_MODEL) {
  throw new Error('EXTRACTOR_TOKEN, OPENAI_API_KEY and OPENAI_MODEL are required.');
}
const port = Number(process.env.PORT ?? 3001);
const server = serve({ fetch: createApp(token).fetch, port, hostname: process.env.HOST ?? '127.0.0.1' });
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
