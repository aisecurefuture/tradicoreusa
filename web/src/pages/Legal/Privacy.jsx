import Layout from '../../components/Layout/Layout'
import { Link } from 'react-router-dom'

const EFFECTIVE = 'June 11, 2026'
const COMPANY   = 'TradiCore LLC'
const EMAIL     = 'tradicoreusa@gmail.com'
const ADDRESS   = '1100 Sheridan Rd., Unit 5, Winthrop Harbor, IL 60096'

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading text-xl font-bold text-primary mb-3">{title}</h2>
      <div className="text-body leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export default function Privacy() {
  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container-site">
          <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-2">Legal</p>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="text-white/60 mt-2 text-sm">Effective date: {EFFECTIVE}</p>
        </div>
      </div>

      <div className="bg-bg py-14">
        <div className="container-site max-w-3xl">

          <p className="text-body leading-relaxed mb-10">
            {COMPANY} ("TradiCore," "we," "us," or "our") respects your privacy. This Privacy Policy explains
            what information we collect when you visit <strong>tradicoreusa.com</strong>, how we use it, and
            your rights regarding that information. By using our website you agree to the practices described here.
          </p>

          <Section title="1. Information We Collect">
            <p><strong>Information you give us directly:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Contact forms — name, email, phone number, company, and message.</li>
              <li>Quote request forms — the above plus product details (species, volume, profile, delivery state).</li>
              <li>Trade account applications — business name, business type, contractor license number, annual purchase volume, and product interest.</li>
              <li>Account registration — name, email address, and password (stored as a secure hash).</li>
              <li>Order and checkout — billing/shipping address, order details, and payment information. We accept ACH bank transfer; payment details are processed securely and are never stored on our servers.</li>
              <li>Door launch notifications — email address only.</li>
            </ul>

            <p><strong>Information collected automatically:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Log data — IP address, browser type, pages visited, referring URL, and timestamps.</li>
              <li>Analytics — we use Google Analytics 4 and PostHog to understand how visitors use our site (pages viewed, session duration, clicks). Both services may set cookies. See our <Link to="/cookie-policy" className="text-accent hover:underline">Cookie Policy</Link> for details.</li>
              <li>Device information — screen resolution, operating system, and browser version.</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-1">
              <li>To respond to your inquiries and quote requests.</li>
              <li>To process orders and send order confirmations and updates.</li>
              <li>To create and manage your account.</li>
              <li>To review and process trade account applications.</li>
              <li>To notify you when requested products (e.g., doors) become available.</li>
              <li>To improve our website content, product offerings, and user experience.</li>
              <li>To send transactional emails (order confirmations, quote follow-ups). We do not send marketing emails without your explicit consent.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </Section>

          <Section title="3. How We Share Your Information">
            <p>We do not sell, rent, or trade your personal information. We share it only with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Email delivery (Resend):</strong> we use Resend to deliver transactional emails. Your name and email are transmitted to their servers solely to send the email.</li>
              <li><strong>Analytics providers:</strong> Google Analytics and PostHog receive anonymized usage data. See their respective privacy policies for how they handle that data.</li>
              <li><strong>Payment processing:</strong> ACH bank transfers are processed through our banking partner. We pass only the minimum information required to complete your payment.</li>
              <li><strong>Legal requirements:</strong> if required by law, subpoena, or to protect our legal rights.</li>
            </ul>
          </Section>

          <Section title="4. Cookies">
            <p>
              We use cookies and similar technologies for analytics and to remember your preferences (e.g., cart contents).
              For a full breakdown of the cookies we set, see our <Link to="/cookie-policy" className="text-accent hover:underline">Cookie Policy</Link>.
            </p>
          </Section>

          <Section title="5. Data Retention">
            <p>
              We retain contact and quote form submissions for up to 3 years to allow us to reference past inquiries.
              Account information is retained as long as your account is active. Order records are retained for 7 years
              for tax and accounting purposes. You may request deletion at any time (see Section 7).
            </p>
          </Section>

          <Section title="6. Data Security">
            <p>
              Our website is served over HTTPS. Our API enforces rate limiting, strict CORS policies, and input validation
              on all form submissions. Passwords are hashed using industry-standard algorithms and never stored in plain text.
              Payment data is handled securely — we never store your bank account details on our servers.
            </p>
            <p>
              No method of transmission over the internet is 100% secure. While we take reasonable precautions, we cannot
              guarantee absolute security.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>Depending on your location you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Access</strong> the personal data we hold about you.</li>
              <li><strong>Correct</strong> inaccurate data.</li>
              <li><strong>Delete</strong> your data ("right to be forgotten").</li>
              <li><strong>Opt out</strong> of analytics tracking (see Cookie Policy).</li>
              <li><strong>Data portability</strong> — receive a copy of your data in a portable format.</li>
            </ul>
            <p>
              To exercise any of these rights, email us at{' '}
              <a href={`mailto:${EMAIL}`} className="text-accent hover:underline">{EMAIL}</a> with the subject
              line "Privacy Request." We will respond within 30 days.
            </p>
          </Section>

          <Section title="8. Children's Privacy">
            <p>
              Our website is not directed to children under 13. We do not knowingly collect personal information from
              anyone under 13. If you believe a child has submitted information to us, please contact us and we will
              delete it promptly.
            </p>
          </Section>

          <Section title="9. Third-Party Links">
            <p>
              Our site may contain links to third-party websites (e.g., LinkedIn profiles, product suppliers). We are not
              responsible for the privacy practices of those sites and encourage you to review their policies.
            </p>
          </Section>

          <Section title="10. Illinois Residents">
            <p>
              {COMPANY} is registered in Illinois. Illinois residents may have additional rights under the Illinois Personal
              Information Protection Act (PIPA). We do not sell personal information as defined under Illinois law.
              For questions, contact us at the address below.
            </p>
          </Section>

          <Section title="11. Changes to This Policy">
            <p>
              We may update this policy from time to time. The effective date at the top of this page will reflect any
              changes. Material changes will be noted on our website. Continued use of the site after changes constitutes
              acceptance of the updated policy.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p>Questions or requests regarding this Privacy Policy:</p>
            <address className="not-italic mt-2 text-sm bg-white border border-border rounded-lg p-5 inline-block">
              <strong>{COMPANY}</strong><br />
              {ADDRESS}<br />
              <a href={`mailto:${EMAIL}`} className="text-accent hover:underline">{EMAIL}</a>
            </address>
          </Section>

          <div className="mt-10 pt-6 border-t border-border text-sm text-muted">
            <Link to="/cookie-policy" className="text-accent hover:underline mr-4">Cookie Policy →</Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
