import Layout from '../../components/Layout/Layout'
import { Link } from 'react-router-dom'

const EFFECTIVE = 'June 11, 2026'
const EMAIL     = 'tradicoreusa@gmail.com'

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading text-xl font-bold text-primary mb-3">{title}</h2>
      <div className="text-body leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

function CookieTable({ rows }) {
  return (
    <div className="overflow-x-auto mt-3 mb-2">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-primary text-white">
            <th className="text-left px-4 py-2 font-semibold rounded-tl">Cookie / Service</th>
            <th className="text-left px-4 py-2 font-semibold">Purpose</th>
            <th className="text-left px-4 py-2 font-semibold">Duration</th>
            <th className="text-left px-4 py-2 font-semibold rounded-tr">Type</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-bg'}>
              <td className="px-4 py-2.5 font-medium text-primary">{r[0]}</td>
              <td className="px-4 py-2.5 text-muted">{r[1]}</td>
              <td className="px-4 py-2.5 text-muted">{r[2]}</td>
              <td className="px-4 py-2.5 text-muted">{r[3]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Cookies() {
  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container-site">
          <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-2">Legal</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">Cookie Policy</h1>
          <p className="text-white/60 mt-2 text-sm">Effective date: {EFFECTIVE}</p>
        </div>
      </div>

      <div className="bg-bg py-14">
        <div className="container-site max-w-3xl">

          <p className="text-body leading-relaxed mb-10">
            This Cookie Policy explains how TradiCore Lumber and Products LLC ("TradiCore," "we," "us") uses
            cookies and similar tracking technologies on <strong>tradicoreusa.com</strong>. It should be read
            alongside our <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
          </p>

          <Section title="1. What Are Cookies?">
            <p>
              Cookies are small text files placed on your device by a website. They allow the site to remember
              your actions and preferences over a period of time so you don't have to re-enter them each visit.
              Similar technologies include local storage and session storage, which we use to keep your cart
              contents available between page loads.
            </p>
          </Section>

          <Section title="2. Cookies We Use">

            <p><strong>Strictly Necessary</strong></p>
            <p className="text-sm text-muted">Required for the site to function. Cannot be disabled.</p>
            <CookieTable rows={[
              ['tc_cart',          'Stores your shopping cart contents in browser local storage', 'Until cleared',   'First-party / localStorage'],
              ['tc_trade_banner',  'Remembers if you dismissed the trade account banner',          'Persistent',      'First-party / localStorage'],
              ['tc_auth_token',    'Keeps you signed in to your account',                          'Session / 30 days', 'First-party / localStorage'],
            ]} />

            <p className="mt-4"><strong>Analytics</strong></p>
            <p className="text-sm text-muted">
              Help us understand how visitors use the site so we can improve it. No personal information is sold.
              You may opt out — see Section 4.
            </p>
            <CookieTable rows={[
              ['_ga, _ga_*',       'Google Analytics 4 — measures page visits, session duration, and traffic sources', '2 years',  'Third-party (Google)'],
              ['ph_*',             'PostHog — records page views, clicks, and form interaction patterns',               '1 year',   'Third-party (PostHog)'],
            ]} />

          </Section>

          <Section title="3. Third-Party Services">
            <p>We embed or link to the following third-party services that may set their own cookies:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Google Analytics 4</strong> — usage analytics.{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google Privacy Policy</a>
              </li>
              <li>
                <strong>PostHog</strong> — product analytics.{' '}
                <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">PostHog Privacy Policy</a>
              </li>
              <li>
                <strong>Stripe</strong> — payment processing (checkout pages only).{' '}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Stripe Privacy Policy</a>
              </li>
              <li>
                <strong>PayPal</strong> — payment processing (checkout pages only).{' '}
                <a href="https://www.paypal.com/us/legalhub/privacy-full" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">PayPal Privacy Policy</a>
              </li>
            </ul>
          </Section>

          <Section title="4. How to Opt Out or Manage Cookies">
            <p><strong>Browser settings</strong></p>
            <p>
              All major browsers allow you to refuse or delete cookies through their settings. Disabling
              strictly necessary cookies (local storage) will break cart and login functionality.
            </p>

            <p><strong>Google Analytics opt-out</strong></p>
            <p>
              Install the{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                Google Analytics Opt-out Browser Add-on
              </a>{' '}
              to prevent your data from being used by Google Analytics across all sites.
            </p>

            <p><strong>PostHog opt-out</strong></p>
            <p>
              PostHog respects the browser's Do Not Track signal. You can also open your browser console on
              our site and run <code className="bg-bg-warm px-1.5 py-0.5 rounded text-sm font-mono">posthog.opt_out_capturing()</code> to
              stop PostHog tracking on this device.
            </p>

            <p><strong>Do Not Track</strong></p>
            <p>
              We honor the browser's Do Not Track (DNT) header. When DNT is enabled, analytics collection
              is suppressed on our site.
            </p>
          </Section>

          <Section title="5. Changes to This Policy">
            <p>
              We may update this Cookie Policy as our tools or legal obligations change. The effective date
              at the top reflects the most recent revision. Please check back periodically.
            </p>
          </Section>

          <Section title="6. Contact">
            <p>
              Questions about our cookie practices? Email us at{' '}
              <a href={`mailto:${EMAIL}`} className="text-accent hover:underline">{EMAIL}</a>.
            </p>
          </Section>

          <div className="mt-10 pt-6 border-t border-border text-sm text-muted">
            <Link to="/privacy" className="text-accent hover:underline mr-4">Privacy Policy →</Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
