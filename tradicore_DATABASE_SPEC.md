# TradiCore USA — Database Architecture Spec
## For Claude Code & Backend Developer Reference

---

## Auth Architecture: How Option 1 + Option 2 Work Together

This schema deliberately uses BOTH approaches:

### Supabase Auth (Option 2) handles:
- Password hashing (bcrypt, managed by Supabase — never stored in your tables)
- Google OAuth token exchange and storage
- Facebook OAuth token exchange and storage
- JWT generation and signing
- Email verification flows
- Password reset flows
- Session management
- Brute force / rate limit protection

### Your `public.users` table (Option 1) handles:
- All business data (account type, trade status, Net30 limits, company info)
- Admin management of accounts
- CRM data, notes, competitive intel
- Pricing tier assignments
- Everything Supabase Auth doesn't know about

### The link:
`public.users.id` is a UUID that directly references `auth.users.id`.
When a user signs up (any method), a row is created in BOTH tables.
Use a Supabase database trigger or your backend to create the `public.users`
row automatically when `auth.users` gets a new row.

```sql
-- Trigger to auto-create public.users row on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, auth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.app_metadata->>'provider', 'email')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Google & Facebook OAuth Setup (Supabase Dashboard)

1. Supabase Dashboard → Authentication → Providers
2. Enable Google: requires Google Cloud Console OAuth 2.0 credentials
3. Enable Facebook: requires Facebook Developer App credentials
4. Callback URL to register in both: `https://[your-supabase-project].supabase.co/auth/v1/callback`
5. On the frontend, trigger with: `supabase.auth.signInWithOAuth({ provider: 'google' })`
6. After OAuth callback, `public.users` row is auto-created by the trigger above

No custom OAuth code needed in your backend. Supabase handles it entirely.

---

## ACH / NACHA Compliance Notes

NACHA rules require you to retain proof of authorization. This schema captures:

| NACHA Requirement                    | Where stored                                          |
|--------------------------------------|-------------------------------------------------------|
| Written authorization from customer  | `payments.ach_mandate_accepted` + `ach_mandate_accepted_at` |
| IP address of authorization          | `payments.ach_mandate_ip`                             |
| Account type (checking/savings)       | `payments.ach_account_type`                           |
| Bank account last 4                  | `payments.ach_last4`                                  |
| Return codes (R01 = insufficient funds, etc.) | `payments.ach_return_code`               |
| Saved mandates for recurring charges | `saved_payment_methods.ach_mandate_*`                 |

The mandate text that must appear in your UI (from the Claude Code prompt):
> "By confirming, you authorize TradiCore LLC to debit your bank account
>  for this and future orders per your agreement."

Stripe handles the actual NACHA file submission and bank communication.
You are responsible for displaying the mandate text and capturing consent.

---

## Stripe Integration Points

### Required Stripe objects:
- `stripe_customer_id` — create one per user at checkout, store in `saved_payment_methods`
- `stripe_payment_intent_id` — one per order, store in `payments`
- `stripe_payment_method_id` — store in `saved_payment_methods` for reuse

### ACH flow:
1. Frontend: Stripe Payment Element with ACH enabled
2. Customer links bank via Stripe Financial Connections
3. Stripe returns a `payment_method` object with `type: 'us_bank_account'`
4. Your backend creates a PaymentIntent, stores intent ID in `payments`
5. Store `ach_mandate_accepted = true`, `ach_mandate_ip`, `ach_mandate_accepted_at`
6. ACH settles in 3-5 business days — update `payment_status` via Stripe webhook
7. If ACH returns (R01, R02, etc.) — Stripe sends webhook, store `ach_return_code`

### Stripe webhooks to handle:
- `payment_intent.succeeded` → update `payments.status = 'succeeded'`, `orders.payment_status = 'paid'`
- `payment_intent.payment_failed` → update status, notify customer
- `payment_intent.processing` → ACH in flight
- `charge.updated` (ACH return) → store return code, notify customer, put order on hold

---

## Pricing Tier Logic

Three price columns on `products`:
- `price` — standard retail price (shown to all)
- `trade_price` — shown/charged to users where `account_type = 'trade'` AND `trade_approved = TRUE`
- `distributor_price` — shown/charged to `account_type = 'distributor'`

Backend should check `users.account_type` and `users.trade_approved` at checkout
to determine which price to use. Never trust the frontend to send the correct price.

---

## Net30 — SCHEMA ONLY. DO NOT BUILD INTO UI.

> ⚠️ IMPORTANT FOR CLAUDE CODE AND DEVELOPERS:
> Net30 payment terms were NOT requested by TradiCore and are NOT in any
> source documents. The schema columns exist because they are cheap to store
> and expensive to add later. DO NOT:
> - Show a Net30 option anywhere in the checkout UI
> - Show a Net30 option in the trade application form
> - Reference Net30 in any customer-facing copy or UI element
> - Build any Net30 approval workflow or receivables logic
>
> Net30 is a FUTURE BUSINESS DECISION for Alan Pan and Mohammad Akhtar to make
> when they have a credit approval process and AR management in place.
> It must be explicitly enabled by TradiCore before any frontend work begins.

Fields in schema (dormant until enabled):
- `users.net30_approved` — default FALSE, never set to TRUE by any current code path
- `users.net30_credit_limit` — NULL until feature is enabled
- `users.net30_current_balance` — always 0.00 until feature is enabled
- `users.net30_approved_by` + `net30_approved_at` — unused until enabled
- `orders.payment_due_date` — unused until enabled
- `orders.payment_method` enum includes 'net30' — but checkout UI must NOT offer it

When/if TradiCore decides to enable Net30 (future phase):
1. Check `users.net30_approved = TRUE`
2. Check `order.total <= (users.net30_credit_limit - users.net30_current_balance)`
3. Create order with `payment_method = 'net30'`, `payment_status = 'unpaid'`
4. Set `payment_due_date = CURRENT_DATE + 30`
5. Increment `users.net30_current_balance` by order total
6. When paid, decrement balance, update `orders.payment_status = 'paid'`

---

## Key Business Rules to Enforce in Backend (not in DB)

1. **Never trust frontend prices** — always look up price server-side based on user's account_type
2. **ACH mandate required** — refuse to create ACH PaymentIntent if `ach_mandate_accepted = FALSE`
3. **Net30 requires approval** — check `net30_approved` before allowing net30 payment method
4. **Cart → Order atomically** — use a transaction when converting cart to order to prevent double-orders
5. **Order number sequence** — handled by DB trigger, do not set manually
6. **Email uniqueness** — enforced by CITEXT UNIQUE on users.email

---

## Environment Variables Needed (.env)

```
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=           # public, used by frontend
SUPABASE_SERVICE_ROLE_KEY=   # secret, backend only — full DB access, bypasses RLS

# Stripe
STRIPE_PUBLISHABLE_KEY=      # public, used by frontend
STRIPE_SECRET_KEY=           # secret, backend only
STRIPE_WEBHOOK_SECRET=       # for validating Stripe webhook events

# PayPal
PAYPAL_CLIENT_ID=            # public, used by frontend
PAYPAL_CLIENT_SECRET=        # secret, backend only
PAYPAL_MODE=                 # 'sandbox' | 'live'

# App
REACT_APP_API_URL=           # your backend API base URL
NODE_ENV=                    # 'development' | 'production'
```

**Never store these in code.** Use your hosting provider's secret management
(Railway, Render, Fly.io, Vercel all have built-in env var storage).

---

## Table Summary

| Table                      | Purpose                                          | ~Row count at launch |
|----------------------------|--------------------------------------------------|----------------------|
| users                      | All customer/admin accounts                      | 0 → grows            |
| user_auth_providers        | Google/Facebook OAuth linkage                    | 0 → grows            |
| password_reset_attempts    | Rate limiting for password resets                | ephemeral            |
| login_audit                | Security log                                     | high volume          |
| addresses                  | Shipping/billing addresses                       | 0 → grows            |
| product_categories         | 11 categories (seeded)                           | 11                   |
| products                   | All products in catalog                          | ~60 at launch        |
| product_attributes         | Flexible spec data                               | ~200 at launch       |
| product_relations          | Related products                                 | manual               |
| carts                      | Active and abandoned carts                       | high volume          |
| cart_items                 | Items in carts                                   | high volume          |
| orders                     | All orders                                       | 0 → grows            |
| order_items                | Line items per order                             | 0 → grows            |
| order_status_history       | Full status audit trail                          | 0 → grows            |
| payments                   | All payment attempts                             | 0 → grows            |
| refunds                    | Refund records                                   | low volume           |
| saved_payment_methods      | Saved ACH/card for repeat customers              | 0 → grows            |
| trade_applications         | Trade account applications                       | 0 → grows            |
| distributor_inquiries      | Distributor/retail partner leads                 | 0 → grows            |
| quote_requests             | Hardwood and volume quote requests               | 0 → grows            |
| contact_submissions        | General contact form                             | 0 → grows            |
| notify_signups             | Door launch email list                           | 0 → grows            |
| promo_codes                | Discount codes                                   | few                  |
| customer_notes             | CRM notes from Alan/Mohammad                     | 0 → grows            |
| activity_log               | Admin audit log                                  | high volume          |

---

## What This Schema Does NOT Include (Future Phases)

- Inventory management / warehouse locations
- EDI / vendor portal integration (for Home Depot-type accounts)
- Multi-currency pricing
- Tax calculation tables (use TaxJar or Stripe Tax API instead)
- Shipping rate tables (use EasyPost or ShipBob API instead)
- Product reviews / ratings
- Loyalty / points system
- Multi-location / franchise support
- Supplier/purchase order management
