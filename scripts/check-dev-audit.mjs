import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

/**
 * Temporary exception for GHSA-vfj7-8cjw-p6xm in Next's ESLint-only chain.
 * The GitHub advisory has no patched braces release as of 2026-10-16.
 * Production dependencies are separately audited with --omit=dev in CI.
 * This policy expires so a maintainer must review it, not forget it.
 */
const EXPIRES_AT = Date.parse('2026-11-16T00:00:00Z')
const EXPECTED_CHAIN = new Map([
  ['braces', ['GHSA-vfj7-8cjw-p6xm']],
  ['micromatch', ['braces']],
  ['fast-glob', ['micromatch']],
  ['@next/eslint-plugin-next', ['fast-glob']],
  ['eslint-config-next', ['@next/eslint-plugin-next']],
])

export function checkAuditReport(report, lock, now = Date.now()) {
  if (!report || typeof report !== 'object' || !report.vulnerabilities || !report.metadata) {
    throw new Error('npm audit did not return a valid report')
  }
  const findings = Object.entries(report.vulnerabilities)
    .filter(([, finding]) => ['high', 'critical'].includes(finding.severity))
  if (findings.length === 0) return 'No high or critical dependency advisories'
  if (now >= EXPIRES_AT) throw new Error('The braces exception expired; review the advisory and toolchain')
  if (findings.length !== EXPECTED_CHAIN.size) throw new Error('A new high or critical advisory needs review')

  for (const [name, finding] of findings) {
    const allowedVia = EXPECTED_CHAIN.get(name)
    const via = finding.via?.map((entry) => typeof entry === 'string'
      ? entry
      : entry.url?.split('/').at(-1))
    if (!allowedVia || JSON.stringify(via) !== JSON.stringify(allowedVia)) {
      throw new Error(`Unexpected advisory or dependency chain: ${name}`)
    }
    if (finding.nodes?.length !== 1 || finding.nodes[0] !== `node_modules/${name}`) {
      throw new Error(`Unexpected install path for ${name}`)
    }
  }

  const packages = lock?.packages
  if (packages?.['node_modules/braces']?.version !== '3.0.3' ||
      [...EXPECTED_CHAIN.keys()].some((name) => packages?.[`node_modules/${name}`]?.dev !== true)) {
    throw new Error('The exception no longer matches the reviewed dev-only lockfile')
  }
  return 'Accepted dev-only GHSA-vfj7-8cjw-p6xm exception until 2026-11-16; no other high/critical findings'
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  try {
    let output
    try {
      output = execFileSync('npm', ['audit', '--json'], { encoding: 'utf8', maxBuffer: 10_000_000 })
    } catch (error) {
      output = error.stdout
    }
    const report = JSON.parse(output)
    const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'))
    console.log(checkAuditReport(report, lock))
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
