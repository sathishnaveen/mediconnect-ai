import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

function loadEnvFile() {
  const envPath = path.join(ROOT, '.env')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (key && !(key in process.env)) process.env[key] = value
  }
}

loadEnvFile()

const knowledge = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'shared', 'knowledge.json'), 'utf8'),
)

const PORT = Number(process.env.PORT) || 3001
const DEMO_NOTE =
  'Sample answer from the built-in FAQ knowledge base - no AI model was called. Set AI_API_KEY (or GROQ_API_KEY) in .env to enable live AI replies.'

function resolveAIConfig() {
  const apiKey =
    process.env.AI_API_KEY || process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const usingOpenAIKey =
    !process.env.AI_API_KEY &&
    !process.env.GROQ_API_KEY &&
    Boolean(process.env.OPENAI_API_KEY)

  const baseUrl =
    process.env.AI_BASE_URL ||
    (usingOpenAIKey ? 'https://api.openai.com/v1' : 'https://api.groq.com/openai/v1')
  const model =
    process.env.AI_MODEL || (usingOpenAIKey ? 'gpt-4o-mini' : 'llama-3.3-70b-versatile')

  return { apiKey, baseUrl, model, provider: usingOpenAIKey ? 'OpenAI' : 'Groq / OpenAI-compatible' }
}

function buildSystemPrompt() {
  const clinic = knowledge.clinic
  return [
    `You are the friendly clinic assistant for ${clinic.name}, a demo healthcare website.`,
    'Your job is ONLY to answer questions about: clinic services, doctor specialties, opening hours, location, fees and payments, telemedicine, and the steps to book an appointment.',
    'Answer in max 5 short sentences, in plain, warm, professional English. No markdown headings, no bullet lists.',
    'HARD SAFETY RULES:',
    '- Never diagnose a condition, never interpret symptoms as a disease, never suggest medication, dosage or treatment plans.',
    '- Never claim to be a doctor or nurse. You are a clinic information assistant.',
    '- If the user describes symptoms or asks a medical question, briefly say you cannot help medically, mention the emergency line if it sounds urgent, and suggest booking an appointment.',
    `- If anything sounds like an emergency, reply with this exact line: "${knowledge.emergency}"`,
    '- If you do not know the answer, say you can only help with clinic information and give the phone number.',
    `CLINIC FACTS (demo data): address ${clinic.address}; phone ${clinic.phone}; email ${clinic.email}; hours ${clinic.hours
      .map((h) => `${h.days} ${h.time}`)
      .join('; ')}; services: ${clinic.services.join(', ')}; specialties: ${clinic.specialties.join(', ')}.`,
    `Appointment booking steps: ${knowledge.bookingSteps.join(' -> ')}.`,
    `Closing note to include when relevant: ${knowledge.disclaimer}`,
  ].join('\n')
}

function findBestFaq(text) {
  const normalized = String(text).toLowerCase()
  const words = normalized.split(/[^a-z0-9]+/).filter((w) => w.length > 3)
  let best = null
  let bestScore = 0
  for (const faq of knowledge.faqs) {
    let score = 0
    for (const keyword of faq.keywords) {
      if (normalized.includes(keyword.toLowerCase())) score += keyword.length > 6 ? 3 : 2
    }
    for (const word of words) {
      if (faq.question.toLowerCase().includes(word)) score += 1
    }
    if (score > bestScore) {
      bestScore = score
      best = faq
    }
  }
  return bestScore > 0 ? best : null
}

function demoReply(messages) {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  const match = lastUser ? findBestFaq(lastUser.content) : null
  if (!match) return { reply: knowledge.fallback, note: DEMO_NOTE }
  return { reply: match.answer, note: DEMO_NOTE }
}

const rateLimitStore = new Map()
const RATE_WINDOW_MS = 60_000
const RATE_MAX = 30

function isRateLimited(ip) {
  const now = Date.now()
  const entry = rateLimitStore.get(ip)
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  entry.count += 1
  if (rateLimitStore.size > 500) {
    for (const [key, value] of rateLimitStore) {
      if (value.resetAt < now) rateLimitStore.delete(key)
    }
  }
  return entry.count > RATE_MAX
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  })
  res.end(body)
}

function readBody(req, limit = 1_000_000) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (chunk) => {
      size += chunk.length
      if (size > limit) {
        reject(new Error('Payload too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function sanitizeMessages(rawMessages) {
  if (!Array.isArray(rawMessages)) return []
  const allowed = new Set(['user', 'assistant'])
  const clean = []
  for (const message of rawMessages.slice(-12)) {
    if (!message || typeof message !== 'object') continue
    const role = message.role
    const content = typeof message.content === 'string' ? message.content.trim() : ''
    if (!allowed.has(role) || !content) continue
    clean.push({ role, content: content.slice(0, 4000) })
  }
  return clean
}

async function askAI(aiConfig, messages) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 25_000)
  try {
    const response = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aiConfig.apiKey}`,
      },
      body: JSON.stringify({
        model: aiConfig.model,
        messages: [{ role: 'system', content: buildSystemPrompt() }, ...messages],
        temperature: 0.4,
        max_tokens: 700,
      }),
      signal: controller.signal,
    })

    const data = await response.json().catch(() => null)
    const reply =
      data && data.choices && data.choices[0] && data.choices[0].message
        ? data.choices[0].message.content
        : null

    if (!response.ok || !reply) {
      const reason = data && data.error && data.error.message ? data.error.message : `HTTP ${response.status}`
      return {
        mode: 'demo',
        ...demoReply(messages),
        warning: `Live AI request failed (${reason}). Showing a built-in sample answer instead.`,
      }
    }

    return {
      mode: 'ai',
      reply: reply.trim(),
      note: 'AI-generated answer - always confirm medical decisions with a qualified professional.',
      model: aiConfig.model,
      provider: aiConfig.provider,
    }
  } catch (error) {
    const reason = error && error.name === 'AbortError' ? 'request timed out after 25s' : String(error.message || error)
    return {
      mode: 'demo',
      ...demoReply(messages),
      warning: `Live AI request failed (${reason}). Showing a built-in sample answer instead.`,
    }
  } finally {
    clearTimeout(timer)
  }
}

async function handleChat(req, res, ip) {
  if (isRateLimited(ip)) {
    sendJson(res, 429, {
      error: 'Too many messages. Please wait a minute and try again.',
    })
    return
  }

  let payload
  try {
    const raw = await readBody(req)
    payload = JSON.parse(raw)
  } catch {
    sendJson(res, 400, { error: 'Invalid JSON body.' })
    return
  }

  const messages = sanitizeMessages(payload && payload.messages)
  if (messages.length === 0) {
    sendJson(res, 400, { error: 'Provide at least one { role, content } message.' })
    return
  }

  const aiConfig = resolveAIConfig()
  const result = aiConfig
    ? await askAI(aiConfig, messages)
    : {
        mode: 'demo',
        ...demoReply(messages),
        note: DEMO_NOTE,
      }

  sendJson(res, 200, result)
}

function handleHealth(res) {
  const aiConfig = resolveAIConfig()
  sendJson(res, 200, {
    status: 'ok',
    mode: aiConfig ? 'ai' : 'demo',
    aiConfigured: Boolean(aiConfig),
    model: aiConfig ? aiConfig.model : null,
    timestamp: new Date().toISOString(),
    message: aiConfig
      ? 'Live AI is configured.'
      : 'No AI API key found - the chatbot runs in clearly-labelled demo mode.',
  })
}

const server = http.createServer(async (req, res) => {
  const ip = req.socket.remoteAddress || 'unknown'
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    })
    res.end()
    return
  }

  try {
    if (req.method === 'GET' && url.pathname === '/api/health') {
      handleHealth(res)
      return
    }
    if (req.method === 'POST' && url.pathname === '/api/chat') {
      await handleChat(req, res, ip)
      return
    }
    sendJson(res, 404, { error: `Cannot ${req.method} ${url.pathname}` })
  } catch (error) {
    console.error('[server] unhandled error:', error)
    sendJson(res, 500, { error: 'Unexpected server error.' })
  }
})

server.listen(PORT, () => {
  const aiConfig = resolveAIConfig()
  console.info('')
  console.info('  MediConnect AI backend running')
  console.info(`  -> http://localhost:${PORT}/api/health`)
  if (aiConfig) {
    console.info(`  AI mode: LIVE (${aiConfig.provider}, model: ${aiConfig.model})`)
  } else {
    console.info('  AI mode: DEMO (no API key found in .env)')
    console.info('  To enable live AI: copy .env.example to .env and set AI_API_KEY.')
  }
  console.info('')
})
