import { spawnSync } from 'node:child_process'
import { previewDatabase } from './preview-guard.mjs'
const isolated = previewDatabase()
const env = { ...process.env }
if (isolated) {
  // prisma-env/config select the dedicated variables; do not replace inherited ones before validation.
  console.log('Verified explicit preview database configuration.')
}
for (const task of ['db:deploy', 'db:seed:deploy', 'build']) {
  const result = spawnSync('npm', ['run', task], { env, stdio: 'inherit' })
  if (result.status !== 0) process.exit(result.status ?? 1)
}
