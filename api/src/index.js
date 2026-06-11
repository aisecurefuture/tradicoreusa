'use strict'

require('dotenv').config()

const express   = require('express')
const cors      = require('cors')
const helmet    = require('helmet')
const rateLimit = require('express-rate-limit')
const morgan    = require('morgan')

const contactRoutes = require('./routes/contact')

const app  = express()
const PORT = process.env.PORT || 3001

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet())
app.use(morgan('combined'))

// CORS — allow only the frontend origin in production
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) {
      // In production, reject no-origin requests (blocks curl/bots in prod while allowing dev)
      if (process.env.NODE_ENV === 'production') return cb(new Error('CORS: origin required'))
      return cb(null, true)
    }
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return cb(null, true)
    }
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}))

app.use(express.json({ limit: '32kb' }))

// Rate limiting — 10 form submissions per IP per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please wait 15 minutes and try again.' },
})

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api', limiter, contactRoutes)

// Health check (not rate-limited)
app.get('/health', (_req, res) => res.json({ ok: true }))

// 404 catch-all
app.use((_req, res) => res.status(404).json({ success: false, error: 'Not found' }))

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('[error]', err.message)
  res.status(500).json({ success: false, error: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`[api] TradiCore API listening on port ${PORT}`)
  console.log(`[api] NODE_ENV=${process.env.NODE_ENV || 'development'}`)
  if (!process.env.RESEND_API_KEY) {
    console.warn('[api] RESEND_API_KEY not set — emails will be logged only')
  }
})
