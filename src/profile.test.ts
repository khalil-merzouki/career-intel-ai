import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createApp } from './app.js';
import type { ProfileExtraction } from './profile-schema.js';

const extraction: ProfileExtraction = {
  currentRole: 'Designer', experience: [{ role: 'Designer', company: 'Acme', period: '2022–present', description: '' }],
  skills: [{ name: 'Figma', proficiency: 'Unspecified' }], education: [], certifications: [],
  languages: [], interests: [], workModels: [], locations: [],
  salaryCurrency: '', salaryMinimum: '', salaryTarget: '',
};
const body = { text: 'Product Designer at Acme from 2022 to present. Skilled in Figma.' };
const headers = { 'content-type': 'application/json', authorization: 'Bearer test-token' };

test('CV endpoint requires token and valid text', async () => {
  const app = createApp('test-token', undefined, async () => extraction);
  assert.equal((await app.request('/extract-profile', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } })).status, 401);
  assert.equal((await app.request('/extract-profile', { method: 'POST', body: JSON.stringify({ text: 'short' }), headers })).status, 400);
});

test('CV endpoint returns validated extraction and hides model failures', async () => {
  const app = createApp('test-token', undefined, async () => extraction);
  const response = await app.request('/extract-profile', { method: 'POST', body: JSON.stringify(body), headers });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), extraction);
  const failing = createApp('test-token', undefined, async () => { throw new Error('private model failure'); });
  const error = await failing.request('/extract-profile', { method: 'POST', body: JSON.stringify(body), headers });
  assert.equal(error.status, 503);
  assert.deepEqual(await error.json(), { message: 'CV extraction is unavailable.' });
});
