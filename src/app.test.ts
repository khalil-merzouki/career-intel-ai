import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createApp } from './app.js';
import type { Extraction } from './schema.js';

const extraction: Extraction = { role: 'Engineer', company: 'Acme', location: 'Unknown', workType: 'unknown', salary: '', salarySource: 'estimated', seniority: '', experience: '', requirements: [] };
const body = { description: 'We are hiring an engineer to work on our product team. The role includes building software, reviewing changes, and collaborating with designers and product managers.', url: '' };

test('rejects unauthenticated requests and malformed descriptions', async () => {
  const app = createApp('test-token', async () => extraction);
  const noToken = await app.request('/extract-job', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } });
  assert.equal(noToken.status, 401);
  const bad = await app.request('/extract-job', { method: 'POST', body: JSON.stringify({ description: 'short', url: '' }), headers: { 'content-type': 'application/json', authorization: 'Bearer test-token' } });
  assert.equal(bad.status, 400);
});

test('returns validated extraction and hides upstream failures', async () => {
  const app = createApp('test-token', async () => extraction);
  const response = await app.request('/extract-job', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json', authorization: 'Bearer test-token' } });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), extraction);
  const failing = createApp('test-token', async () => { throw new Error('private upstream detail'); });
  const error = await failing.request('/extract-job', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json', authorization: 'Bearer test-token' } });
  assert.equal(error.status, 503);
  assert.deepEqual(await error.json(), { message: 'Job extraction is unavailable.' });
});
