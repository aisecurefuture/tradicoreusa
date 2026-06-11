'use strict'

// Shared styles
const base = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin:0; padding:0; background:#f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrap { max-width:600px; margin:32px auto; background:#fff; border-radius:8px; overflow:hidden; border:1px solid #e5e5e5; }
    .header { background:#0D2137; padding:28px 32px; }
    .logo { color:#C9A84C; font-size:22px; font-weight:700; letter-spacing:-0.5px; text-decoration:none; }
    .logo span { color:#fff; }
    .body { padding:32px; color:#333; font-size:15px; line-height:1.6; }
    .label { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.8px; color:#888; margin-bottom:4px; }
    .value { font-size:15px; color:#111; margin-bottom:16px; }
    .section { background:#fafafa; border:1px solid #eee; border-radius:6px; padding:16px 20px; margin:16px 0; }
    .footer { background:#f9f9f9; border-top:1px solid #eee; padding:20px 32px; font-size:12px; color:#999; }
    h2 { margin:0 0 20px; font-size:20px; color:#0D2137; }
    .badge { display:inline-block; background:#C9A84C20; color:#C9A84C; font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; margin-bottom:16px; }
    hr { border:none; border-top:1px solid #eee; margin:20px 0; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <a class="logo" href="https://tradicoreusa.com">Tradi<span>Core</span> <span style="font-weight:400;font-size:14px;color:#ffffff99">Lumber and Products</span></a>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      TradiCore Lumber and Products &bull; Chicago, IL &bull;
      <a href="mailto:tradicoreusa@gmail.com" style="color:#C9A84C">tradicoreusa@gmail.com</a>
    </div>
  </div>
</body>
</html>`

// ── Internal notification emails (to the TradiCore team) ─────────────────────

exports.internalContact = (d) => base(`
  <div class="badge">General Inquiry</div>
  <h2>New contact form submission</h2>

  <div class="section">
    <div class="label">From</div>
    <div class="value">${d.name} &lt;${d.email}&gt;${d.phone ? ` &bull; ${d.phone}` : ''}${d.company ? ` &bull; ${d.company}` : ''}</div>
    <div class="label">Subject</div>
    <div class="value">${d.subject}</div>
  </div>

  <div class="label">Message</div>
  <div class="value" style="white-space:pre-wrap;background:#fafafa;border:1px solid #eee;border-radius:6px;padding:16px 20px;">${escHtml(d.message)}</div>
`)

exports.internalHardwoodQuote = (d) => base(`
  <div class="badge">Hardwood Quote Request</div>
  <h2>New hardwood quote request</h2>

  <div class="section">
    <div class="label">Contact</div>
    <div class="value">${d.name} &lt;${d.email}&gt;${d.phone ? ` &bull; ${d.phone}` : ''}${d.company ? ` &bull; ${d.company}` : ''}</div>
  </div>

  <div class="section">
    <div class="label">Species</div><div class="value">${d.species}</div>
    <div class="label">Application</div><div class="value">${d.application}</div>
    <div class="label">Volume</div><div class="value">${d.volumeBf} board feet</div>
    ${d.thickness    ? `<div class="label">Thickness</div><div class="value">${d.thickness}</div>` : ''}
    ${d.gradeNotes   ? `<div class="label">Grade / notes</div><div class="value">${escHtml(d.gradeNotes)}</div>` : ''}
    ${d.deliveryState ? `<div class="label">Delivery state</div><div class="value">${d.deliveryState}</div>` : ''}
    ${d.jobStart     ? `<div class="label">Needed by</div><div class="value">${d.jobStart}</div>` : ''}
    <div class="label">FSC required</div><div class="value">${d.fscRequired ? 'Yes' : 'No'}</div>
  </div>

  ${d.message ? `<div class="label">Additional notes</div><div class="value" style="white-space:pre-wrap;background:#fafafa;border:1px solid #eee;border-radius:6px;padding:16px 20px;">${escHtml(d.message)}</div>` : ''}
`)

exports.internalMouldingQuote = (d) => base(`
  <div class="badge">Moulding Quote Request</div>
  <h2>New moulding quote request</h2>

  <div class="section">
    <div class="label">Contact</div>
    <div class="value">${d.name} &lt;${d.email}&gt;${d.phone ? ` &bull; ${d.phone}` : ''}${d.company ? ` &bull; ${d.company}` : ''}</div>
  </div>

  <div class="section">
    <div class="label">Category</div><div class="value">${d.category}</div>
    ${d.profiles    ? `<div class="label">Profiles / SKUs</div><div class="value">${escHtml(d.profiles)}</div>` : ''}
    <div class="label">Linear feet</div><div class="value">${d.linearFeet} lf</div>
    ${d.finish      ? `<div class="label">Finish</div><div class="value">${d.finish}</div>` : ''}
    ${d.deliveryState ? `<div class="label">Delivery state</div><div class="value">${d.deliveryState}</div>` : ''}
    ${d.jobStart    ? `<div class="label">Needed by</div><div class="value">${d.jobStart}</div>` : ''}
  </div>

  ${d.message ? `<div class="label">Additional notes</div><div class="value" style="white-space:pre-wrap;background:#fafafa;border:1px solid #eee;border-radius:6px;padding:16px 20px;">${escHtml(d.message)}</div>` : ''}
`)

exports.internalTradeApplication = (d) => base(`
  <div class="badge">Trade Account Application</div>
  <h2>New trade account application</h2>

  <div class="section">
    <div class="label">Contact</div>
    <div class="value">${d.firstName} ${d.lastName}${d.title ? `, ${d.title}` : ''}</div>
    <div class="value">${d.email} &bull; ${d.phone}</div>
    ${d.company ? `<div class="label">Company</div><div class="value">${escHtml(d.company)}</div>` : ''}
    ${d.businessType ? `<div class="label">Business type</div><div class="value">${escHtml(d.businessType)}</div>` : ''}
    ${d.licenseNumber ? `<div class="label">License #</div><div class="value">${escHtml(d.licenseNumber)}</div>` : ''}
    ${d.city || d.state ? `<div class="label">Location</div><div class="value">${[d.city, d.state].filter(Boolean).join(', ')}</div>` : ''}
  </div>

  <div class="section">
    <div class="label">Annual volume</div><div class="value">${d.annualVolume}</div>
    <div class="label">Product interest</div><div class="value">${(d.productInterest || []).join(', ')}</div>
    ${d.howHeard ? `<div class="label">How they heard</div><div class="value">${escHtml(d.howHeard)}</div>` : ''}
  </div>

  ${d.message ? `<div class="label">Additional notes</div><div class="value" style="white-space:pre-wrap;background:#fafafa;border:1px solid #eee;border-radius:6px;padding:16px 20px;">${escHtml(d.message)}</div>` : ''}
`)

// ── Auto-reply emails (to the customer) ──────────────────────────────────────

exports.autoReplyContact = (d) => base(`
  <h2>Thanks for reaching out, ${escHtml(d.name.split(' ')[0])}.</h2>
  <p>We received your message and will get back to you at <strong>${d.email}</strong> within 24 hours.</p>
  <div class="section">
    <div class="label">Your subject</div>
    <div class="value">${escHtml(d.subject)}</div>
    <div class="label">Your message</div>
    <div class="value" style="white-space:pre-wrap;">${escHtml(d.message)}</div>
  </div>
  <hr/>
  <p style="font-size:13px;color:#888;">If you have an urgent question, call us at <strong>224-715-6452</strong> or email <a href="mailto:tradicoreusa@gmail.com" style="color:#C9A84C;">tradicoreusa@gmail.com</a>.</p>
`)

exports.autoReplyQuote = (type, d) => base(`
  <h2>Quote request received, ${escHtml(d.name.split(' ')[0])}.</h2>
  <p>We received your ${type === 'hardwood' ? 'hardwood' : 'moulding'} quote request and will follow up at <strong>${d.email}</strong> within <strong>1 business day</strong>.</p>
  ${type === 'hardwood' ? `
  <div class="section">
    <div class="label">Species</div><div class="value">${escHtml(d.species)}</div>
    <div class="label">Application</div><div class="value">${escHtml(d.application)}</div>
    <div class="label">Volume</div><div class="value">${escHtml(d.volumeBf)} board feet</div>
  </div>` : `
  <div class="section">
    <div class="label">Category</div><div class="value">${escHtml(d.category)}</div>
    <div class="label">Linear feet</div><div class="value">${escHtml(String(d.linearFeet))} lf</div>
  </div>`}
  <hr/>
  <p style="font-size:13px;color:#888;">Questions? Email <a href="mailto:tradicoreusa@gmail.com" style="color:#C9A84C;">tradicoreusa@gmail.com</a> or call <strong>224-715-6452</strong>.</p>
`)

exports.autoReplyTrade = (d) => base(`
  <h2>Application received, ${escHtml(d.firstName)}.</h2>
  <p>Thanks for applying for a TradiCore Lumber and Products trade account. Our team will review your application and follow up at <strong>${d.email}</strong> within <strong>2 business days</strong>.</p>
  <div class="section">
    <div class="label">Company</div><div class="value">${escHtml(d.company)}</div>
    <div class="label">Annual volume</div><div class="value">${escHtml(d.annualVolume)}</div>
    <div class="label">Product interest</div><div class="value">${(d.productInterest || []).join(', ')}</div>
  </div>
  <hr/>
  <p style="font-size:13px;color:#888;">Questions? Email <a href="mailto:tradicoreusa@gmail.com" style="color:#C9A84C;">tradicoreusa@gmail.com</a>.</p>
`)

// ── Notify me (door launch) ───────────────────────────────────────────────────
exports.autoReplyNotify = (email) => base(`
  <h2>You're on the list.</h2>
  <p>We'll notify <strong>${escHtml(email)}</strong> as soon as the TradiCore door line is available for online ordering.</p>
  <hr/>
  <p style="font-size:13px;color:#888;">In the meantime, browse our <a href="https://tradicoreusa.com/collections/moulding-trim" style="color:#C9A84C;">moulding & trim</a> and <a href="https://tradicoreusa.com/collections/tropical-hardwood" style="color:#C9A84C;">tropical hardwood</a> collections.</p>
`)

// ── Account: welcome email ────────────────────────────────────────────────────
exports.welcomeEmail = (user) => base(`
  <h2>Welcome to TradiCore, ${escHtml(user.first_name)}.</h2>
  <p>Your account has been created. You can now request quotes, track orders, and apply for trade pricing — all from one place.</p>
  <div class="section">
    <div class="label">Email</div><div class="value">${escHtml(user.email)}</div>
    <div class="label">Account type</div><div class="value" style="text-transform:capitalize;">${escHtml(user.account_type)}</div>
  </div>
  <p><a href="https://tradicoreusa.com/account" style="display:inline-block;background:#C9A84C;color:#0D2137;font-weight:700;padding:12px 24px;border-radius:6px;text-decoration:none;">Go to My Account</a></p>
  <hr/>
  <p style="font-size:13px;color:#888;">Looking to get wholesale pricing? <a href="https://tradicoreusa.com/trade" style="color:#C9A84C;">Apply for a trade account →</a></p>
`)

// ── Account: password reset ───────────────────────────────────────────────────
exports.passwordResetEmail = (firstName, resetUrl) => base(`
  <h2>Reset your password, ${escHtml(firstName)}.</h2>
  <p>We received a request to reset the password for your TradiCore account. Click the button below — this link expires in <strong>1 hour</strong>.</p>
  <p style="margin:28px 0;">
    <a href="${resetUrl}" style="display:inline-block;background:#C9A84C;color:#0D2137;font-weight:700;padding:12px 24px;border-radius:6px;text-decoration:none;">Reset My Password</a>
  </p>
  <p style="font-size:13px;color:#888;">If the button doesn't work, copy and paste this link into your browser:</p>
  <p style="font-size:12px;word-break:break-all;color:#555;">${resetUrl}</p>
  <hr/>
  <p style="font-size:13px;color:#888;">If you didn't request this, you can ignore this email — your password won't change.</p>
`)

// =============================================================================
// First Golden Logistics templates
// =============================================================================

const fglBase = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { margin:0; padding:0; background:#f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrap { max-width:600px; margin:32px auto; background:#fff; border-radius:8px; overflow:hidden; border:1px solid #e5e5e5; }
    .header { background:#111; padding:28px 32px; display:flex; align-items:center; gap:14px; }
    .logo-text { color:#C9A020; font-size:20px; font-weight:800; letter-spacing:-0.5px; }
    .logo-text span { color:#fff; font-weight:400; }
    .body { padding:32px; color:#333; font-size:15px; line-height:1.6; }
    .label { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.8px; color:#888; margin-bottom:4px; }
    .value { font-size:15px; color:#111; margin-bottom:16px; }
    .section { background:#fafafa; border:1px solid #eee; border-radius:6px; padding:16px 20px; margin:16px 0; }
    .footer { background:#111; padding:20px 32px; font-size:12px; color:#888; }
    .footer a { color:#C9A020; text-decoration:none; }
    h2 { margin:0 0 20px; font-size:20px; color:#111; }
    .badge { display:inline-block; background:#C9A02015; color:#C9A020; font-size:11px; font-weight:700;
             padding:3px 10px; border-radius:20px; margin-bottom:16px; letter-spacing:0.4px; }
    hr { border:none; border-top:1px solid #eee; margin:20px 0; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div class="logo-text">First Golden <span>Logistics</span></div>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      First Golden Logistics &bull; Chicago, USA &bull;
      <a href="mailto:dex@firstgoldenlogistics.com">firstgoldenlogistics.com</a>
    </div>
  </div>
</body>
</html>`

// Internal notification — sent to Alan, Mohammad, and Dex
exports.fglInternalContact = (d) => fglBase(`
  <div class="badge">New Inquiry</div>
  <h2>New readiness check request</h2>

  <div class="section">
    <div class="label">Name</div>
    <div class="value">${escHtml(d.name)}</div>
    <div class="label">Company / Brand</div>
    <div class="value">${escHtml(d.company)}</div>
    <div class="label">Email</div>
    <div class="value"><a href="mailto:${escHtml(d.email)}" style="color:#C9A020;">${escHtml(d.email)}</a></div>
    ${d.phone ? `<div class="label">Phone</div><div class="value">${escHtml(d.phone)}</div>` : ''}
  </div>

  ${d.product ? `
  <div class="label">About their product</div>
  <div class="value" style="white-space:pre-wrap;background:#fafafa;border:1px solid #eee;border-radius:6px;padding:16px 20px;">${escHtml(d.product)}</div>
  ` : ''}
`)

// Auto-reply — sent to the person who submitted the form
exports.fglAutoReply = (d) => fglBase(`
  <h2>We'll be in touch, ${escHtml(d.name.split(' ')[0])}.</h2>
  <p>Thanks for reaching out to First Golden Logistics. Our team has received your request and will follow up at <strong>${escHtml(d.email)}</strong> within one business day.</p>
  <div class="section">
    <div class="label">What happens next</div>
    <div class="value">One of our principals — Mohammad, Alan, or Dex — will reach out to schedule your free U.S. Readiness Check call. The call is 20 minutes, no commitment.</div>
  </div>
  <hr/>
  <p style="font-size:13px;color:#888;">
    Questions in the meantime? Reply to this email or call us directly:<br/>
    Mohammad Akhtar — <a href="tel:+18475053302" style="color:#C9A020;">+1 (847) 505-3302</a><br/>
    Alan Pan — <a href="tel:+12247156452" style="color:#C9A020;">+1 (224) 715-6452</a><br/>
    Dex — <a href="tel:+16303943535" style="color:#C9A020;">+1 (630) 394-3535</a>
  </p>
`)

// =============================================================================

function escHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
