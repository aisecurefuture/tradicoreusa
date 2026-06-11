'use strict'

const express    = require('express')
const bcrypt     = require('bcrypt')
const jwt        = require('jsonwebtoken')
const crypto     = require('crypto')
const { z }      = require('zod')
const pool       = require('../db')
const { sendEmail } = require('../mailer')
const requireAuth = require('../middleware/authMiddleware')
const t          = require('../emails/templates')

const router = express.Router()

const SALT_ROUNDS = 12
const JWT_EXPIRES = '30d'

const JWT_SECRET  = process.env.JWT_SECRET
const APP_URL     = process.env.APP_URL || 'https://tradicoreusa.com'
const FROM_NOREPLY = process.env.FROM_NOREPLY || 'no-reply@mail.tradicoreusa.com'
const FROM_SALES   = process.env.FROM_SALES   || 'TradiCore <sales@mail.tradicoreusa.com>'

// ── Validation schemas ────────────────────────────────────────────────────────

const registerSchema = z.object({
  firstName:   z.string().min(1).max(80),
  lastName:    z.string().min(1).max(80),
  email:       z.string().email(),
  password:    z.string().min(8).max(128),
  companyName: z.string().max(120).optional(),
  phone:       z.string().max(30).optional(),
  marketingOptIn: z.boolean().optional(),
})

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

const forgotSchema = z.object({
  email: z.string().email(),
})

const resetSchema = z.object({
  token:    z.string().min(1),
  password: z.string().min(8).max(128),
})

const profileUpdateSchema = z.object({
  firstName:      z.string().min(1).max(80).optional(),
  lastName:       z.string().min(1).max(80).optional(),
  companyName:    z.string().max(120).optional(),
  phone:          z.string().max(30).optional(),
  title:          z.string().max(80).optional(),
  marketingOptIn: z.boolean().optional(),
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

function sanitize(user) {
  const { password_hash, ...safe } = user
  return safe
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.account_type },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  )
}

// ── POST /auth/register ───────────────────────────────────────────────────────

router.post('/register', async (req, res) => {
  const { ok, error, data } = validate(registerSchema, req.body)
  if (!ok) return res.status(400).json({ success: false, error })

  const hash = await bcrypt.hash(data.password, SALT_ROUNDS)

  let user
  try {
    const { rows } = await pool.query(
      `INSERT INTO app_users
         (email, password_hash, first_name, last_name, company_name, phone, marketing_opt_in)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, first_name, last_name, company_name, phone, title,
                 account_type, trade_approved, marketing_opt_in, created_at`,
      [
        data.email,
        hash,
        data.firstName,
        data.lastName,
        data.companyName || null,
        data.phone       || null,
        data.marketingOptIn !== false,
      ]
    )
    user = rows[0]
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ success: false, error: 'An account with that email already exists.' })
    }
    console.error('[auth] register error:', err.message)
    return res.status(500).json({ success: false, error: 'Registration failed. Please try again.' })
  }

  const token = signToken(user)

  // Fire-and-forget welcome email
  sendEmail({
    from:    FROM_SALES,
    to:      user.email,
    subject: 'Welcome to TradiCore',
    html:    t.welcomeEmail(user),
  }).catch(err => console.error('[auth] welcome email error:', err.message))

  res.status(201).json({ success: true, token, user: sanitize(user) })
})

// ── POST /auth/login ──────────────────────────────────────────────────────────

router.post('/login', async (req, res) => {
  const { ok, error, data } = validate(loginSchema, req.body)
  if (!ok) return res.status(400).json({ success: false, error })

  let user
  try {
    const { rows } = await pool.query(
      `SELECT * FROM app_users WHERE email = $1 AND is_active = TRUE`,
      [data.email]
    )
    user = rows[0]
  } catch (err) {
    console.error('[auth] login db error:', err.message)
    return res.status(500).json({ success: false, error: 'Login failed. Please try again.' })
  }

  // Use a constant-time compare even on a missing user to avoid timing attacks
  const hash = user?.password_hash || '$2b$12$invalidhashplaceholderXXXXXXXXXXXXXXXXXXXXXXXXX'
  const match = await bcrypt.compare(data.password, hash)

  if (!user || !match) {
    return res.status(401).json({ success: false, error: 'Invalid email or password.' })
  }

  // Update last_login_at (non-blocking)
  pool.query('UPDATE app_users SET last_login_at = NOW() WHERE id = $1', [user.id])
    .catch(err => console.error('[auth] last_login update error:', err.message))

  const token = signToken(user)
  res.json({ success: true, token, user: sanitize(user) })
})

// ── POST /auth/forgot-password ────────────────────────────────────────────────

router.post('/forgot-password', async (req, res) => {
  const { ok, error, data } = validate(forgotSchema, req.body)
  if (!ok) return res.status(400).json({ success: false, error })

  // Always respond 200 — never reveal whether the email exists
  res.json({ success: true, message: 'If that email is registered, a reset link is on its way.' })

  try {
    const { rows } = await pool.query(
      `SELECT id, email, first_name FROM app_users WHERE email = $1 AND is_active = TRUE`,
      [data.email]
    )
    if (rows.length === 0) return

    const user  = rows[0]
    const token = crypto.randomBytes(32).toString('hex')
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Invalidate any prior unused tokens for this user
    await pool.query(
      `UPDATE password_reset_tokens SET used_at = NOW()
       WHERE user_id = $1 AND used_at IS NULL AND expires_at > NOW()`,
      [user.id]
    )

    await pool.query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
      [user.id, token, expires]
    )

    const resetUrl = `${APP_URL}/reset-password?token=${token}`

    await sendEmail({
      from:    FROM_NOREPLY,
      to:      user.email,
      subject: 'Reset your TradiCore password',
      html:    t.passwordResetEmail(user.first_name, resetUrl),
    })
  } catch (err) {
    console.error('[auth] forgot-password error:', err.message)
  }
})

// ── POST /auth/reset-password ─────────────────────────────────────────────────

router.post('/reset-password', async (req, res) => {
  const { ok, error, data } = validate(resetSchema, req.body)
  if (!ok) return res.status(400).json({ success: false, error })

  let tokenRow
  try {
    const { rows } = await pool.query(
      `SELECT * FROM password_reset_tokens
       WHERE token = $1 AND used_at IS NULL AND expires_at > NOW()`,
      [data.token]
    )
    tokenRow = rows[0]
  } catch (err) {
    console.error('[auth] reset-password db error:', err.message)
    return res.status(500).json({ success: false, error: 'Reset failed. Please try again.' })
  }

  if (!tokenRow) {
    return res.status(400).json({ success: false, error: 'Reset link is invalid or has expired.' })
  }

  const hash = await bcrypt.hash(data.password, SALT_ROUNDS)

  try {
    await pool.query('UPDATE app_users SET password_hash = $1 WHERE id = $2', [hash, tokenRow.user_id])
    await pool.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1', [tokenRow.id])
  } catch (err) {
    console.error('[auth] reset-password update error:', err.message)
    return res.status(500).json({ success: false, error: 'Reset failed. Please try again.' })
  }

  res.json({ success: true, message: 'Password updated. You can now log in.' })
})

// ── GET /auth/profile ─────────────────────────────────────────────────────────

router.get('/profile', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, email, first_name, last_name, company_name, phone, title,
              account_type, trade_approved, marketing_opt_in, created_at, last_login_at
       FROM app_users WHERE id = $1 AND is_active = TRUE`,
      [req.user.sub]
    )
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Account not found.' })
    }
    res.json({ success: true, user: rows[0] })
  } catch (err) {
    console.error('[auth] profile error:', err.message)
    res.status(500).json({ success: false, error: 'Could not load profile.' })
  }
})

// ── PUT /auth/profile ─────────────────────────────────────────────────────────

router.put('/profile', requireAuth, async (req, res) => {
  const { ok, error, data } = validate(profileUpdateSchema, req.body)
  if (!ok) return res.status(400).json({ success: false, error })

  const fields = []
  const values = []
  let idx = 1

  if (data.firstName      !== undefined) { fields.push(`first_name = $${idx++}`);      values.push(data.firstName) }
  if (data.lastName       !== undefined) { fields.push(`last_name = $${idx++}`);       values.push(data.lastName) }
  if (data.companyName    !== undefined) { fields.push(`company_name = $${idx++}`);    values.push(data.companyName || null) }
  if (data.phone          !== undefined) { fields.push(`phone = $${idx++}`);           values.push(data.phone || null) }
  if (data.title          !== undefined) { fields.push(`title = $${idx++}`);           values.push(data.title || null) }
  if (data.marketingOptIn !== undefined) { fields.push(`marketing_opt_in = $${idx++}`); values.push(data.marketingOptIn) }

  if (fields.length === 0) {
    return res.status(400).json({ success: false, error: 'No fields to update.' })
  }

  values.push(req.user.sub)

  try {
    const { rows } = await pool.query(
      `UPDATE app_users SET ${fields.join(', ')}
       WHERE id = $${idx} AND is_active = TRUE
       RETURNING id, email, first_name, last_name, company_name, phone, title,
                 account_type, trade_approved, marketing_opt_in, created_at, last_login_at`,
      values
    )
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Account not found.' })
    }
    res.json({ success: true, user: rows[0] })
  } catch (err) {
    console.error('[auth] profile update error:', err.message)
    res.status(500).json({ success: false, error: 'Update failed. Please try again.' })
  }
})

module.exports = router
