import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const viteBin = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js')

if (!fs.existsSync(viteBin)) {
  console.error('')
  console.error('  Dependencies are not installed yet.')
  console.error('  Run this first:  npm install')
  console.error('')
  process.exit(1)
}

const children = []
let shuttingDown = false

function shutdown(code) {
  if (shuttingDown) return
  shuttingDown = true
  for (const child of children) {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill()
    }
  }
  process.exit(code)
}

function run(label, script) {
  const child = spawn(process.execPath, [script], {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: '1' },
  })
  child.on('exit', (code, signal) => {
    if (!shuttingDown) {
      console.error(`[dev] "${label}" stopped (code: ${code ?? signal})`)
      shutdown(code ?? 1)
    }
  })
  children.push(child)
  return child
}

console.info('')
console.info('  Starting MediConnect AI...')
console.info('  Frontend   -> http://localhost:5173')
console.info('  AI server  -> http://localhost:3001/api/health')
console.info('  Press Ctrl+C to stop both.')
console.info('')

run('ai-server', path.join(ROOT, 'server', 'index.js'))
run('vite', viteBin)

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
