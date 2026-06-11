'use strict'

const { Router } = require('express')
const { z }      = require('zod')
const pool       = require('../db')
const { sendEmail } = require('../mailer')
const t          = require('../emails/templates')

const router = Router()

const FGL_TEAM = (process.env.FGL_TEAM_EMAILS || 'yp@firstgoldenlogistics.com,mohammad@firstgoldenlogistics.com,dex@firstgoldenlogistics.com')
  .split(',').map(e => e.trim()).filter(Boolean)

const FROM_NOREPLY = process.env.FGL_FROM_NOREPLY || process.env.FROM_NOREPLY || 'no-reply@mail.tradicoreusa.com'
const FROM_SALES   = process.env.FGL_FROM_SALES   || process.env.FROM_SALES   || 'First Golden Logistics <sales@mail.tradicoreusa.com>'

const contactSchema = z.object({
  name:    z.string().min(1).max(120),
  company: z.string().min(1).max(120),
  email:   z.string().email(),
  phone:   z.string().max(40).optional(),
  product: z.string().max(2000).optional(),
})

function validate(schema, body) {
  const result = schema.safeParse(body)
  if (!result.success) {
    const msg = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
    return { ok: false, error: msg }
  }
  return { ok: true, data: result.data }
}

const stripNL = (s = '') => String(s).replace(/[\r\n]/g, ' ').trim()

// POST /api/fgl/contact
router.post('/contact', async (req, res) => {
  const { ok, error, data } = validate(contactSchema, req.body)
  if (!ok) return res.status(400).json({ success: false, error })

  // Persist to DB
  try {
    await pool.query(
      `INSERT INTO fgl_contact_submissions (name, company, email, phone, product_desc, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        data.name,
        data.company,
        data.email,
        data.phone   || null,
        data.product || null,
        req.ip       || null,
      ]
    )
  } catch (err) {
    console.error('[fgl] db error:', err.message)
    // Continue — still send emails even if DB write fails
  }

  // Email all three team members in one send
  await Promise.all([
    sendEmail({
      from:    FROM_NOREPLY,
      to:      FGL_TEAM,
      subject: `[FGL Inquiry] ${stripNL(data.name)} — ${stripNL(data.company)}`,
      html:    t.fglInternalContact(data),
    }),
    sendEmail({
      from:    FROM_SALES,
      to:      data.email,
      subject: 'We received your message — First Golden Logistics',
      html:    t.fglAutoReply(data),
    }),
  ])

  res.json({ success: true })
})

module.exports = router
