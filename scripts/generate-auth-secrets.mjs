#!/usr/bin/env node
/**
 * Generates a sign-in secret, or an admin password hash, and copies it to the clipboard.
 * The value is never printed, so it cannot end up in a terminal log or a screen share.
 *
 *   node scripts/generate-auth-secrets.mjs secret   -> NEXTAUTH_SECRET
 *   node scripts/generate-auth-secrets.mjs hash     -> ADMIN_PASSWORD_HASH (asks for the password)
 *
 * Paste the result into Vercel -> Settings -> Environment Variables (Production).
 * Vercel needs the value exactly as copied. Only a LOCAL .env file needs each "$" escaped as "\$".
 */
import { spawnSync } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { createInterface } from 'node:readline'
import bcrypt from 'bcryptjs'

function copyToClipboard(value) {
  const commands = {
    win32: ['clip', []],
    darwin: ['pbcopy', []],
    linux: ['xclip', ['-selection', 'clipboard']],
  }
  const entry = commands[process.platform]
  if (!entry) return false
  const result = spawnSync(entry[0], entry[1], { input: value, shell: process.platform === 'win32' })
  return result.status === 0
}

/** Reads one line without echoing it when attached to a terminal. */
function readSecretLine(prompt) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: process.stdin.isTTY })
    if (process.stdin.isTTY) {
      rl._writeToOutput = (text) => {
        if (text.includes(prompt)) process.stdout.write(text)
      }
    }
    rl.question(prompt, (answer) => {
      rl.close()
      if (process.stdin.isTTY) process.stdout.write('\n')
      resolve(answer)
    })
  })
}

const mode = process.argv[2]

if (mode === 'secret') {
  const ok = copyToClipboard(randomBytes(32).toString('base64'))
  console.log(ok ? 'A new NEXTAUTH_SECRET is on your clipboard. Paste it into Vercel now.' : 'Could not reach the clipboard on this system.')
  process.exit(ok ? 0 : 1)
}

if (mode === 'hash') {
  const password = await readSecretLine('Admin password (not shown): ')
  if (password.length < 12) {
    console.error('Use at least 12 characters.')
    process.exit(1)
  }
  const again = process.stdin.isTTY ? await readSecretLine('Type it again: ') : password
  if (again !== password) {
    console.error('The two entries did not match.')
    process.exit(1)
  }
  const ok = copyToClipboard(bcrypt.hashSync(password, 10))
  console.log(ok ? 'The ADMIN_PASSWORD_HASH is on your clipboard. Paste it into Vercel now.' : 'Could not reach the clipboard on this system.')
  process.exit(ok ? 0 : 1)
}

console.error('Usage: node scripts/generate-auth-secrets.mjs secret | hash')
process.exit(1)
