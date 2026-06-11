'use strict'

const { Resend } = require('resend')

let resend

function getClient() {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

/**
 * Send an email via Resend.
 * In development (NODE_ENV !== 'production'), logs instead of sending
 * unless RESEND_API_KEY is explicitly set.
 */
async function sendEmail({ from, to, replyTo, subject, html }) {
  if (process.env.NODE_ENV !== 'production' && !process.env.RESEND_API_KEY) {
    console.log('[mailer:dev] Would send email:')
    console.log(`  From:    ${from}`)
    console.log(`  To:      ${to}`)
    console.log(`  Subject: ${subject}`)
    return { id: 'dev-stub' }
  }

  const client = getClient()
  const payload = { from, to, subject, html }
  if (replyTo) payload.replyTo = replyTo

  const { data, error } = await client.emails.send(payload)
  if (error) {
    console.error('[mailer] Resend error:', error)
    throw new Error(error.message || 'Failed to send email')
  }
  return data
}

module.exports = { sendEmail }
