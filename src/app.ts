import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { bodyLimit } from 'hono/body-limit';
import { zValidator } from '@hono/zod-validator';
import { extractJob } from './extract.js';
import { extractionSchema, requestSchema, type ExtractRequest, type Extraction } from './schema.js';

export function createApp(
  token: string,
  extract: (input: ExtractRequest) => Promise<Extraction> = extractJob,
) {
  if (!token) throw new Error('EXTRACTOR_TOKEN must be configured.');
  const app = new Hono();
  app.get('/health', (c) => c.json({ status: 'ok' }));
  app.use('/extract-job', bearerAuth({ token }));
  app.use('/extract-job', bodyLimit({ maxSize: 100_000 }));
  app.post('/extract-job', zValidator('json', requestSchema), async (c) => {
    try {
      const output = extractionSchema.parse(await extract(c.req.valid('json')));
      return c.json(output);
    } catch {
      return c.json({ message: 'Job extraction is unavailable.' }, 503);
    }
  });
  return app;
}
