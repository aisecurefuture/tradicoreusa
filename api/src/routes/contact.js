'use strict'

const { Router } = require('express')
const { z } = require('zod')
const { sendEmail } = require('../mailer')
const t    = require('../emails/templates')
const pool = require('../db')

const router = Router()

// ── Validation schemas ────────────────────────────────────────────────────────
const contactSchema = z.object({
  name:    z.string().min(1),
  email:   z.string().email(),
  phone:   z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
})

const hardwoodSchema = z.object({
  name:          z.string().min(1),
  email:         z.string().email(),
  phone:         z.string().optional(),
  company:       z.string().optional(),
  species:       z.string().min(1),
  application:   z.string().min(1),
  volumeBf:      z.string().min(1),
  thickness:     z.string().optional(),
  gradeNotes:    z.string().optional(),
  jobStart:      z.string().optional(),
  deliveryState: z.string().optional(),
  fscRequired:   z.boolean().optional(),
  message:       z.string().optional(),
})

const mouldingSchema = z.object({
  name:          z.string().min(1),
  email:         z.string().email(),
  phone:         z.string().optional(),
  company:       z.string().optional(),
  category:      z.string().min(1),
  profiles:      z.string().optional(),
  linearFeet:    z.string().min(1),
  finish:        z.string().optional(),
  deliveryState: z.string().optional(),
  jobStart:      z.string().optional(),
  message:       z.string().optional(),
})

const tradeSchema = z.object({
  firstName:       z.string().min(1),
  lastName:        z.string().min(1),
  email:           z.string().email(),
  phone:           z.string().min(1),
  company:         z.string().min(1),
  title:           z.string().optional(),
  city:            z.string().optional(),
  state:           z.string().optional(),
  businessType:    z.string().min(1),
  licenseNumber:   z.string().optional(),
  annualVolume:    z.string().min(1),
  productInterest: z.array(z.string()).min(1),
  howHeard:        z.string().optional(),
  message:         z.string().optional(),
})

const notifySchema = z.object({
  email: z.string().email(),
})

// ── Helpers ───────────────────────────────────────────────────────────────────
function validate(schema, body) {
  const result = schema.safeParse(body)
  if (!result.success) {
    const msg = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
    return { ok: false, error: msg }
  }
  return { ok: true, data: result.data }
}

const TEAM_EMAIL     = process.env.TEAM_EMAIL     || 'tradicoreusa@gmail.com'
const HARDWOOD_EMAIL = process.env.HARDWOOD_EMAIL || 'tradicoreusa@gmail.com'
const SALES_EMAIL    = process.env.SALES_EMAIL    || 'tradicoreusa@gmail.com'
const FROM_NOREPLY   = process.env.FROM_NOREPLY   || 'no-reply@mail.tradicoreusa.com'
const FROM_SALES     = process.env.FROM_SALES     || 'TradiCore Sales <sales@mail.tradicoreusa.com>'
// Override where all inbound replies land — useful before real inboxes are set up
const REPLY_TO       = process.env.REPLY_TO       || SALES_EMAIL

// Strip newlines from any field used in email subject lines to prevent header injection
const stripNL = (s = '') => String(s).replace(/[\r\n]/g, ' ').trim()

// ── Routes ────────────────────────────────────────────────────────────────────

// General contact
router.post('/contact', async (req, res) => {
  const { ok, error, data } = validate(contactSchema, req.body)
  if (!ok) return res.status(400).json({ success: false, error })

  await Promise.all([
    sendEmail({
      from:    FROM_NOREPLY,
      to:      TEAM_EMAIL,
      replyTo: REPLY_TO,
      subject: `[Contact] ${stripNL(data.subject)} — ${stripNL(data.name)}`,
      html:    t.internalContact(data),
    }),
    sendEmail({
      from:    FROM_SALES,
      to:      data.email,
      subject: 'We received your message — TradiCore Lumber and Products',
      html:    t.autoReplyContact(data),
    }),
  ])

  res.json({ success: true })
})

// Quote request (hardwood or moulding)
router.post('/quote', async (req, res) => {
  const type = req.body?.type
  const schema = type === 'hardwood' ? hardwoodSchema : mouldingSchema
  const { ok, error, data } = validate(schema, req.body)
  if (!ok) return res.status(400).json({ success: false, error })

  const toInternal = type === 'hardwood' ? HARDWOOD_EMAIL : SALES_EMAIL
  const subjectTag = type === 'hardwood' ? '[Hardwood Quote]' : '[Moulding Quote]'
  const internalHtml = type === 'hardwood'
    ? t.internalHardwoodQuote(data)
    : t.internalMouldingQuote(data)

  await Promise.all([
    sendEmail({
      from:    FROM_NOREPLY,
      to:      toInternal,
      replyTo: REPLY_TO,
      subject: `${subjectTag} ${stripNL(data.name)}${data.company ? ` — ${stripNL(data.company)}` : ''}`,
      html:    internalHtml,
    }),
    sendEmail({
      from:    FROM_SALES,
      to:      data.email,
      subject: 'Quote request received — TradiCore Lumber and Products',
      html:    t.autoReplyQuote(type, data),
    }),
  ])

  res.json({ success: true })
})

// Trade account application
router.post('/trade', async (req, res) => {
  const { ok, error, data } = validate(tradeSchema, req.body)
  if (!ok) return res.status(400).json({ success: false, error })

  await Promise.all([
    sendEmail({
      from:    FROM_NOREPLY,
      to:      SALES_EMAIL,
      replyTo: REPLY_TO,
      subject: `[Trade Application] ${stripNL(data.firstName)} ${stripNL(data.lastName)} — ${stripNL(data.company)}`,
      html:    t.internalTradeApplication(data),
    }),
    sendEmail({
      from:    FROM_SALES,
      to:      data.email,
      subject: 'Trade account application received — TradiCore Lumber and Products',
      html:    t.autoReplyTrade(data),
    }),
  ])

  res.json({ success: true })
})

// Door notify-me
router.post('/notify', async (req, res) => {
  const { ok, error, data } = validate(notifySchema, req.body)
  if (!ok) return res.status(400).json({ success: false, error })

  // Persist to DB (silently skip if already signed up or DB unavailable)
  let alreadySignedUp = false
  try {
    const result = await pool.query(
      `INSERT INTO notify_signups (email, product_interest, source_page)
       VALUES ($1, 'doors', $2)
       ON CONFLICT (email) DO NOTHING`,
      [data.email, req.headers.referer || null]
    )
    alreadySignedUp = result.rowCount === 0
  } catch (err) {
    console.error('[notify] db error:', err.message)
  }

  // If they're already signed up, skip the emails and return quietly
  if (alreadySignedUp) {
    return res.json({ success: true })
  }

  await Promise.all([
    sendEmail({
      from:    FROM_NOREPLY,
      to:      SALES_EMAIL,
      subject: `[Door Notify] ${stripNL(data.email)}`,
      html:    `<p>New door launch notification signup: <strong>${data.email}</strong></p>`,
    }),
    sendEmail({
      from:    FROM_SALES,
      to:      data.email,
      subject: "You're on the list — TradiCore Doors",
      html:    t.autoReplyNotify(data.email),
    }),
  ])

  res.json({ success: true })
})

module.exports = router
