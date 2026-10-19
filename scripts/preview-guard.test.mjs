import { test } from 'node:test'
import assert from 'node:assert/strict'
import { previewDatabase } from './preview-guard.mjs'
test('preview cannot inherit production data or migrate without explicit isolation', () => {
  assert.equal(previewDatabase({ VERCEL_ENV: 'production' }), null)
  assert.throws(() => previewDatabase({ VERCEL_ENV: 'preview', DATABASE_URL: 'postgresql://prod/db' }))
  const env = { VERCEL_ENV: 'preview', PREVIEW_DATABASE_ISOLATED: 'true', PREVIEW_DATABASE_URL: 'postgresql://user@preview-pooler.example/db', PREVIEW_DIRECT_URL: 'postgresql://user@preview.example/db', DATABASE_URL: 'postgresql://user@prod.example/db' }
  assert.equal(previewDatabase(env).pooled, env.PREVIEW_DATABASE_URL)
  assert.throws(() => previewDatabase({ ...env, DATABASE_URL: env.PREVIEW_DIRECT_URL }))
  assert.throws(() => previewDatabase({ ...env, PREVIEW_DIRECT_URL: 'postgresql://other.example/db' }))
})
