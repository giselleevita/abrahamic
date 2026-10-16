import assert from 'node:assert/strict'
import { test } from 'node:test'
import { checkAuditReport } from './check-dev-audit.mjs'

const lock = { packages: {
  'node_modules/braces': { version: '3.0.3', dev: true },
  'node_modules/micromatch': { dev: true },
  'node_modules/fast-glob': { dev: true },
  'node_modules/@next/eslint-plugin-next': { dev: true },
  'node_modules/eslint-config-next': { dev: true },
} }
const finding = (name, via) => ({ severity: 'high', via, nodes: [`node_modules/${name}`] })
const report = { metadata: {}, vulnerabilities: {
  braces: finding('braces', [{ url: 'https://github.com/advisories/GHSA-vfj7-8cjw-p6xm' }]),
  micromatch: finding('micromatch', ['braces']),
  'fast-glob': finding('fast-glob', ['micromatch']),
  '@next/eslint-plugin-next': finding('@next/eslint-plugin-next', ['fast-glob']),
  'eslint-config-next': finding('eslint-config-next', ['@next/eslint-plugin-next']),
} }

test('accepts only the reviewed dev-tool chain before expiry', () => {
  assert.match(checkAuditReport(report, lock, Date.parse('2026-10-16')), /Accepted dev-only/)
  assert.throws(() => checkAuditReport(report, lock, Date.parse('2026-11-16')), /expired/)
})

test('rejects new findings, changed advisories, and production paths', () => {
  assert.throws(() => checkAuditReport({ ...report, vulnerabilities: { ...report.vulnerabilities, new: finding('new', ['bad']) } }, lock, Date.parse('2026-10-16')), /new high/)
  assert.throws(() => checkAuditReport({ ...report, vulnerabilities: { ...report.vulnerabilities, braces: finding('braces', [{ url: 'https://github.com/advisories/GHSA-other' }]) } }, lock, Date.parse('2026-10-16')), /Unexpected advisory/)
  assert.throws(() => checkAuditReport(report, { packages: { ...lock.packages, 'node_modules/eslint-config-next': { dev: false } } }, Date.parse('2026-10-16')), /dev-only lockfile/)
})
