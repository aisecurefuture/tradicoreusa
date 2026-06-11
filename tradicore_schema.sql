-- =============================================================================
-- TRADICORE USA — PostgreSQL Database Schema
-- Version: 1.0
-- Auth: Supabase Auth (handles password hashing, OAuth, JWT)
--       + custom users table for business data
-- Payments: Stripe (ACH, card) + PayPal
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";  -- case-insensitive text for emails

-- =============================================================================
-- SECTION 1: AUTH & USER MANAGEMENT
-- =============================================================================
-- NOTE: Supabase Auth manages the auth.users table internally.
-- It handles: password hashing (bcrypt), OAuth tokens (Google, Facebook),
-- email verification, password reset, JWT signing.
-- Our public.users table extends auth.users with business data.
-- The auth.users.id is the single source of truth for user identity.
-- =============================================================================

CREATE TABLE public.users (
  -- Identity (linked to Supabase Auth)
  id                  UUID            PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               CITEXT          NOT NULL UNIQUE,

  -- Profile
  first_name          TEXT            NOT NULL,
  last_name           TEXT            NOT NULL,
  company_name        TEXT,
  phone               TEXT,
  title               TEXT,           -- e.g. "Project Manager", "Owner"
  avatar_url          TEXT,           -- from OAuth provider or uploaded

  -- Auth method tracking (informational — Supabase manages the actual tokens)
  auth_provider       TEXT            NOT NULL DEFAULT 'email',
                                      -- 'email' | 'google' | 'facebook' | 'multiple'
  has_password        BOOLEAN         NOT NULL DEFAULT TRUE,
                                      -- FALSE for OAuth-only accounts

  -- Account type & trade status
  account_type        TEXT            NOT NULL DEFAULT 'retail'
                                      CHECK (account_type IN (
                                        'retail',       -- standard customer
                                        'trade',        -- approved contractor/builder
                                        'distributor',  -- wholesale/distribution partner
                                        'admin',        -- TradiCore staff
                                        'sales_rep'     -- future: assigned sales reps
                                      )),
  trade_approved      BOOLEAN         NOT NULL DEFAULT FALSE,
  trade_approved_at   TIMESTAMPTZ,
  trade_approved_by   UUID            REFERENCES public.users(id),
  -- ⚠️  NET30: SCHEMA ONLY — DO NOT SURFACE IN UI.
  -- Not requested by TradiCore. Future business decision by Alan Pan / Mohammad Akhtar.
  -- Keep columns, never set them via any current code path, never show in frontend.
  net30_approved      BOOLEAN         NOT NULL DEFAULT FALSE,
  net30_credit_limit  NUMERIC(10,2),
  net30_approved_at   TIMESTAMPTZ,
  net30_approved_by   UUID            REFERENCES public.users(id),
  net30_current_balance NUMERIC(10,2) NOT NULL DEFAULT 0.00,

  -- Business profile (for trade accounts)
  business_type       TEXT,           -- 'contractor' | 'homebuilder' | 'architect' | etc.
  years_in_business   TEXT,
  employee_count      TEXT,
  website             TEXT,
  state_of_operations TEXT,
  monthly_volume_est  TEXT,           -- estimated monthly purchase volume range
  current_supplier    TEXT,           -- intel: who they currently buy from
  supplier_pain_point TEXT,           -- intel: their pain point with current supplier

  -- Preferences
  preferred_contact   TEXT DEFAULT 'email' CHECK (preferred_contact IN ('email','phone','either')),
  marketing_opt_in    BOOLEAN         NOT NULL DEFAULT TRUE,
  preferred_payment   TEXT,           -- 'ach' | 'card' | 'paypal' | 'net30'

  -- Account status
  is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
  deactivated_at      TIMESTAMPTZ,
  deactivated_reason  TEXT,
  notes               TEXT,           -- internal admin notes

  -- Timestamps
  created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  last_login_at       TIMESTAMPTZ
);

-- Track all OAuth providers linked to an account
-- Allows one account to have both Google AND Facebook AND email linked
CREATE TABLE public.user_auth_providers (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID            NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider            TEXT            NOT NULL CHECK (provider IN ('email','google','facebook')),
  provider_user_id    TEXT,           -- the user's ID from the OAuth provider
  provider_email      TEXT,           -- email as returned by OAuth provider
  linked_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, provider)
);

-- Password reset tokens (managed by Supabase Auth, but track attempts for rate limiting)
CREATE TABLE public.password_reset_attempts (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  email               CITEXT          NOT NULL,
  ip_address          INET,
  attempted_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  succeeded           BOOLEAN         NOT NULL DEFAULT FALSE
);

-- Login audit log (security + support)
CREATE TABLE public.login_audit (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID            REFERENCES public.users(id) ON DELETE SET NULL,
  email               CITEXT,
  provider            TEXT,
  ip_address          INET,
  user_agent          TEXT,
  success             BOOLEAN         NOT NULL,
  failure_reason      TEXT,
  logged_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- SECTION 2: ADDRESSES
-- =============================================================================

CREATE TABLE public.addresses (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID            NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  label               TEXT,           -- 'Home', 'Job Site - Oak St Project', etc.
  first_name          TEXT            NOT NULL,
  last_name           TEXT            NOT NULL,
  company_name        TEXT,
  street_line1        TEXT            NOT NULL,
  street_line2        TEXT,
  city                TEXT            NOT NULL,
  state               CHAR(2)         NOT NULL,
  zip                 TEXT            NOT NULL,
  country             CHAR(2)         NOT NULL DEFAULT 'US',
  phone               TEXT,

  is_default_shipping BOOLEAN         NOT NULL DEFAULT FALSE,
  is_default_billing  BOOLEAN         NOT NULL DEFAULT FALSE,

  created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- SECTION 3: PRODUCT CATALOG
-- =============================================================================

CREATE TABLE public.product_categories (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT            NOT NULL UNIQUE,
  name                TEXT            NOT NULL,
  description         TEXT,
  parent_id           UUID            REFERENCES public.product_categories(id),
  product_line        TEXT            NOT NULL CHECK (product_line IN (
                                        'moulding_trim',    -- MDF/engineered products
                                        'tropical_hardwood',-- raw wood species
                                        'doors'             -- coming soon
                                      )),
  display_order       INTEGER         NOT NULL DEFAULT 0,
  is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
  is_coming_soon      BOOLEAN         NOT NULL DEFAULT FALSE,
  image_url           TEXT,
  meta_title          TEXT,
  meta_description    TEXT,
  created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TABLE public.products (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id         UUID            NOT NULL REFERENCES public.product_categories(id),
  slug                TEXT            NOT NULL UNIQUE,
  sku                 TEXT            NOT NULL UNIQUE,
  name                TEXT            NOT NULL,

  -- Product line classification
  product_line        TEXT            NOT NULL CHECK (product_line IN (
                                        'moulding_trim',
                                        'tropical_hardwood',
                                        'doors'
                                      )),

  -- Pricing
  price               NUMERIC(10,4)   NOT NULL,   -- base retail price
  trade_price         NUMERIC(10,4),              -- trade account price (NULL = same as retail)
  distributor_price   NUMERIC(10,4),              -- wholesale price
  unit                TEXT            NOT NULL,   -- 'per linear ft' | 'per board ft' | 'per piece'
  min_order_qty       NUMERIC(10,2)   NOT NULL DEFAULT 1,
  order_increment     NUMERIC(10,2)   NOT NULL DEFAULT 1, -- e.g. must order in multiples of 8ft

  -- Material & finish (primarily for moulding products)
  material            TEXT,           -- 'MDF' | 'Radiata Pine' | 'South American Pine' | 'Poplar' | 'Falcata' | 'LVL'
  finish              TEXT,           -- 'Raw' | 'Primed' | 'Painted' | 'Vinyl Film'
  finish_color        TEXT,           -- e.g. 'Bright White' for painted finish

  -- Species data (primarily for tropical hardwood products)
  species_code        TEXT,           -- 'BAS' | 'BGR' | 'WAN' | etc.
  species_name        TEXT,           -- 'Basralocus'
  species_trade_name  TEXT,           -- 'Double-column Sappanwood'
  species_origin      TEXT DEFAULT 'Suriname, South America',
  durability_grade    TEXT,           -- 'High' | 'Medium' | 'Low'
  density_grade       TEXT,           -- 'Heavy' | 'Medium' | 'Light'
  janka_hardness      INTEGER,        -- Janka hardness rating if known

  -- Dimensions (stored as jsonb for flexibility across product types)
  -- Example: {"length_ft": 8, "width_in": 3.5, "thickness_in": 0.75}
  -- For hardwood: {"length_ft_min": 6, "length_ft_max": 16, "width_in_avg": 6}
  dimensions          JSONB,

  -- Content
  short_description   TEXT,
  description         TEXT,
  applications        TEXT[],         -- e.g. ARRAY['Marine','Decking','Industrial']
  appearance_notes    TEXT,           -- color and grain description
  installation_notes  TEXT,

  -- Media
  primary_image_url   TEXT,
  image_urls          TEXT[],         -- additional images

  -- SEO
  meta_title          TEXT,
  meta_description    TEXT,

  -- Status
  is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
  is_coming_soon      BOOLEAN         NOT NULL DEFAULT FALSE,
  is_featured         BOOLEAN         NOT NULL DEFAULT FALSE,
  in_stock            BOOLEAN         NOT NULL DEFAULT TRUE,
  stock_qty           NUMERIC(10,2),  -- NULL = track manually / made to order
  low_stock_threshold NUMERIC(10,2),

  -- Timestamps
  created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Product attributes for flexible spec storage
-- e.g. fire rating, moisture resistance, certifications
CREATE TABLE public.product_attributes (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id          UUID            NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  attribute_name      TEXT            NOT NULL,   -- 'Fire Rating' | 'FSC Certified' | 'NAICS Code'
  attribute_value     TEXT            NOT NULL,
  display_order       INTEGER         NOT NULL DEFAULT 0
);

-- Related products (manually curated or auto-generated)
CREATE TABLE public.product_relations (
  product_id          UUID            NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  related_product_id  UUID            NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  relation_type       TEXT            NOT NULL DEFAULT 'related'
                                      CHECK (relation_type IN ('related','upsell','cross_sell')),
  display_order       INTEGER         NOT NULL DEFAULT 0,
  PRIMARY KEY (product_id, related_product_id)
);

-- =============================================================================
-- SECTION 4: CART
-- =============================================================================

CREATE TABLE public.carts (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID            REFERENCES public.users(id) ON DELETE SET NULL,
  session_id          TEXT,           -- for guest carts (browser session token)
  status              TEXT            NOT NULL DEFAULT 'active'
                                      CHECK (status IN ('active','converted','abandoned','merged')),
  currency            CHAR(3)         NOT NULL DEFAULT 'USD',
  notes               TEXT,           -- customer notes on the cart
  created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  expires_at          TIMESTAMPTZ     DEFAULT NOW() + INTERVAL '30 days'
);

CREATE TABLE public.cart_items (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id             UUID            NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id          UUID            NOT NULL REFERENCES public.products(id),
  quantity            NUMERIC(10,2)   NOT NULL CHECK (quantity > 0),
  unit_price          NUMERIC(10,4)   NOT NULL, -- price at time of adding to cart
  -- Snapshot of product at add time (in case product changes)
  product_snapshot    JSONB           NOT NULL, -- {name, sku, unit, material, finish}
  added_at            TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- SECTION 5: ORDERS
-- =============================================================================

CREATE TABLE public.orders (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        TEXT            NOT NULL UNIQUE, -- human-readable: TRC-2026-00001
  user_id             UUID            REFERENCES public.users(id) ON DELETE SET NULL,
  cart_id             UUID            REFERENCES public.carts(id),

  -- Status
  status              TEXT            NOT NULL DEFAULT 'pending'
                                      CHECK (status IN (
                                        'pending',          -- payment not yet confirmed
                                        'payment_processing',
                                        'confirmed',        -- payment confirmed
                                        'in_production',    -- for custom/made-to-order items
                                        'ready_to_ship',
                                        'shipped',
                                        'delivered',
                                        'cancelled',
                                        'refunded',
                                        'on_hold'           -- e.g. awaiting Net30 approval
                                      )),

  -- B2B fields
  po_number           TEXT,           -- customer's purchase order number
  account_type_at_order TEXT,         -- snapshot of account_type when order was placed
  needs_invoice       BOOLEAN         NOT NULL DEFAULT FALSE,
  invoice_sent_at     TIMESTAMPTZ,

  -- Addresses (snapshots — don't use live address records)
  shipping_address    JSONB           NOT NULL,
  billing_address     JSONB           NOT NULL,

  -- Pricing
  currency            CHAR(3)         NOT NULL DEFAULT 'USD',
  subtotal            NUMERIC(10,2)   NOT NULL,
  discount_amount     NUMERIC(10,2)   NOT NULL DEFAULT 0.00,
  discount_code       TEXT,
  shipping_amount     NUMERIC(10,2)   NOT NULL DEFAULT 0.00,
  tax_amount          NUMERIC(10,2)   NOT NULL DEFAULT 0.00,
  total               NUMERIC(10,2)   NOT NULL,

  -- Payment
  payment_method      TEXT            NOT NULL
                                      CHECK (payment_method IN (
                                        'stripe_ach',
                                        'stripe_card',
                                        'paypal',
                                        'net30',    -- ⚠️ SCHEMA ONLY: do not offer in checkout UI
                                        'manual'    -- for phone/email orders placed by admin
                                      )),
  payment_status      TEXT            NOT NULL DEFAULT 'unpaid'
                                      CHECK (payment_status IN (
                                        'unpaid',
                                        'pending',          -- ACH initiated, awaiting settlement
                                        'paid',
                                        'partially_refunded',
                                        'fully_refunded',
                                        'failed',
                                        'voided'
                                      )),
  payment_due_date    DATE,           -- for Net30 orders
  paid_at             TIMESTAMPTZ,

  -- Notes
  customer_notes      TEXT,
  internal_notes      TEXT,

  -- Fulfillment
  shipped_at          TIMESTAMPTZ,
  delivered_at        TIMESTAMPTZ,
  tracking_number     TEXT,
  carrier             TEXT,

  -- Timestamps
  created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  cancelled_at        TIMESTAMPTZ,
  cancellation_reason TEXT
);

-- Auto-generate order numbers: TRC-2026-00001
CREATE SEQUENCE order_number_seq START 1;
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'TRC-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
                      LPAD(NEXTVAL('order_number_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

CREATE TABLE public.order_items (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID            NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id          UUID            REFERENCES public.products(id) ON DELETE SET NULL,

  -- Snapshot of product at order time (immutable record)
  product_snapshot    JSONB           NOT NULL,
                      -- {name, sku, unit, material, finish, species_code, category}

  quantity            NUMERIC(10,2)   NOT NULL CHECK (quantity > 0),
  unit_price          NUMERIC(10,4)   NOT NULL,
  trade_discount_pct  NUMERIC(5,2)    NOT NULL DEFAULT 0.00,
  line_total          NUMERIC(10,2)   NOT NULL,

  -- Fulfillment status per line item
  fulfillment_status  TEXT            NOT NULL DEFAULT 'pending'
                                      CHECK (fulfillment_status IN (
                                        'pending','allocated','shipped','delivered','cancelled'
                                      ))
);

-- Order status history (full audit trail)
CREATE TABLE public.order_status_history (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID            NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  from_status         TEXT,
  to_status           TEXT            NOT NULL,
  changed_by          UUID            REFERENCES public.users(id),
  changed_by_type     TEXT            CHECK (changed_by_type IN ('customer','admin','system')),
  note                TEXT,
  changed_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- SECTION 6: PAYMENTS
-- =============================================================================

CREATE TABLE public.payments (
  id                          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id                    UUID            NOT NULL REFERENCES public.orders(id),
  user_id                     UUID            REFERENCES public.users(id),

  -- Payment method
  payment_method              TEXT            NOT NULL
                                              CHECK (payment_method IN (
                                                'stripe_ach','stripe_card','paypal','net30','manual'
                                              )),

  -- Stripe fields
  stripe_payment_intent_id    TEXT            UNIQUE,
  stripe_payment_method_id    TEXT,
  stripe_customer_id          TEXT,           -- Stripe customer object ID

  -- ACH-specific fields (NACHA compliance)
  ach_bank_name               TEXT,
  ach_last4                   TEXT,           -- last 4 of bank account
  ach_account_type            TEXT            CHECK (ach_account_type IN ('checking','savings')),
  ach_routing_last4           TEXT,
  ach_mandate_accepted        BOOLEAN         DEFAULT FALSE,
  ach_mandate_accepted_at     TIMESTAMPTZ,
  ach_mandate_ip              INET,           -- IP address of mandate acceptance (NACHA requirement)
  ach_settlement_date         DATE,           -- expected settlement date (ACH T+3/T+5)
  ach_return_code             TEXT,           -- if ACH returned: R01, R02, etc.

  -- PayPal fields
  paypal_order_id             TEXT,
  paypal_capture_id           TEXT,
  paypal_payer_id             TEXT,

  -- Amounts
  amount                      NUMERIC(10,2)   NOT NULL,
  currency                    CHAR(3)         NOT NULL DEFAULT 'USD',
  amount_refunded             NUMERIC(10,2)   NOT NULL DEFAULT 0.00,

  -- Status
  status                      TEXT            NOT NULL DEFAULT 'pending'
                                              CHECK (status IN (
                                                'pending',
                                                'processing',
                                                'succeeded',
                                                'failed',
                                                'cancelled',
                                                'refunded',
                                                'partially_refunded',
                                                'requires_action',  -- e.g. 3DS auth
                                                'returned'          -- ACH return
                                              )),

  failure_code                TEXT,
  failure_message             TEXT,

  -- Timestamps
  initiated_at                TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  succeeded_at                TIMESTAMPTZ,
  failed_at                   TIMESTAMPTZ
);

-- Refunds (tracked separately for accounting clarity)
CREATE TABLE public.refunds (
  id                          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id                  UUID            NOT NULL REFERENCES public.payments(id),
  order_id                    UUID            NOT NULL REFERENCES public.orders(id),
  initiated_by                UUID            REFERENCES public.users(id),

  stripe_refund_id            TEXT,
  paypal_refund_id            TEXT,

  amount                      NUMERIC(10,2)   NOT NULL,
  reason                      TEXT            NOT NULL,
  notes                       TEXT,
  status                      TEXT            NOT NULL DEFAULT 'pending'
                                              CHECK (status IN (
                                                'pending','succeeded','failed','cancelled'
                                              )),
  created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  succeeded_at                TIMESTAMPTZ
);

-- Saved payment methods (for returning customers)
CREATE TABLE public.saved_payment_methods (
  id                          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     UUID            NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  payment_type                TEXT            NOT NULL
                                              CHECK (payment_type IN ('ach','card')),

  -- Stripe stores the actual sensitive data; we store the reference
  stripe_payment_method_id    TEXT            NOT NULL,
  stripe_customer_id          TEXT            NOT NULL,

  -- Display data (non-sensitive)
  label                       TEXT,           -- 'Business Checking - Chase' (user-set)
  bank_name                   TEXT,           -- for ACH: 'Chase', 'Wells Fargo'
  account_last4               TEXT,           -- last 4 digits
  account_type                TEXT,           -- 'checking' | 'savings' | 'visa' | 'mastercard'
  expiry_month                INTEGER,        -- for cards only
  expiry_year                 INTEGER,        -- for cards only

  -- ACH mandate (NACHA)
  ach_mandate_accepted        BOOLEAN         DEFAULT FALSE,
  ach_mandate_accepted_at     TIMESTAMPTZ,
  ach_mandate_ip              INET,

  is_default                  BOOLEAN         NOT NULL DEFAULT FALSE,
  created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- SECTION 7: TRADE APPLICATIONS & DISTRIBUTOR INQUIRIES
-- =============================================================================

CREATE TABLE public.trade_applications (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID            REFERENCES public.users(id) ON DELETE SET NULL,

  -- Applicant info (captured from form — may differ from user profile)
  first_name          TEXT            NOT NULL,
  last_name           TEXT            NOT NULL,
  email               CITEXT          NOT NULL,
  phone               TEXT,
  title               TEXT,
  company_name        TEXT            NOT NULL,
  website             TEXT,
  business_type       TEXT            NOT NULL,
  years_in_business   TEXT,
  employee_count      TEXT,
  state_of_operations TEXT,

  -- Purchasing intent
  products_of_interest TEXT[],        -- e.g. ARRAY['crown_moulding','tropical_hardwood']
  monthly_volume_est   TEXT,
  order_frequency      TEXT,
  preferred_payment    TEXT,
  currently_sourcing   BOOLEAN,
  current_supplier     TEXT,
  supplier_pain_point  TEXT,          -- valuable competitive intel
  additional_notes     TEXT,

  -- Review & decision
  status              TEXT            NOT NULL DEFAULT 'pending'
                                      CHECK (status IN (
                                        'pending',
                                        'under_review',
                                        'approved',
                                        'declined',
                                        'more_info_needed'
                                      )),
  reviewed_by         UUID            REFERENCES public.users(id),
  reviewed_at         TIMESTAMPTZ,
  review_notes        TEXT,           -- internal notes from Alan/Mohammad
  decline_reason      TEXT,

  -- If approved, link to the user account that was upgraded
  approved_user_id    UUID            REFERENCES public.users(id),

  -- Metadata
  ip_address          INET,
  submitted_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE TABLE public.distributor_inquiries (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name        TEXT            NOT NULL,
  contact_name        TEXT            NOT NULL,
  email               CITEXT          NOT NULL,
  phone               TEXT,
  num_locations       TEXT,
  territory           TEXT,
  business_description TEXT,
  status              TEXT            NOT NULL DEFAULT 'new'
                                      CHECK (status IN ('new','contacted','in_discussion','declined','onboarded')),
  notes               TEXT,
  ip_address          INET,
  submitted_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- SECTION 8: QUOTES (for tropical hardwood & large orders)
-- =============================================================================

CREATE TABLE public.quote_requests (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number        TEXT            NOT NULL UNIQUE, -- TCQ-2026-00001
  user_id             UUID            REFERENCES public.users(id) ON DELETE SET NULL,

  -- Contact info (may differ from account)
  first_name          TEXT            NOT NULL,
  last_name           TEXT            NOT NULL,
  email               CITEXT          NOT NULL,
  phone               TEXT,
  company_name        TEXT,

  -- What they want
  inquiry_type        TEXT            NOT NULL DEFAULT 'general'
                                      CHECK (inquiry_type IN (
                                        'general',
                                        'tropical_hardwood',
                                        'moulding_volume',
                                        'custom_profile',
                                        'net30_application'
                                      )),
  species_codes       TEXT[],         -- e.g. ARRAY['BAS','RLO'] for hardwood quotes
  products_of_interest TEXT[],
  quantity_description TEXT,          -- free text: "~500 board ft of BAS"
  intended_use        TEXT,
  project_timeline    TEXT,
  additional_notes    TEXT,

  -- Quote response
  status              TEXT            NOT NULL DEFAULT 'new'
                                      CHECK (status IN (
                                        'new','assigned','quoted','accepted',
                                        'declined','expired','converted_to_order'
                                      )),
  assigned_to         UUID            REFERENCES public.users(id),
  quoted_amount       NUMERIC(10,2),
  quote_valid_until   DATE,
  quote_notes         TEXT,
  converted_order_id  UUID            REFERENCES public.orders(id),

  -- Metadata
  source              TEXT,           -- 'website' | 'phone' | 'email'
  ip_address          INET,
  submitted_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE SEQUENCE quote_number_seq START 1;
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.quote_number := 'TCQ-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
                      LPAD(NEXTVAL('quote_number_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_quote_number
  BEFORE INSERT ON public.quote_requests
  FOR EACH ROW
  WHEN (NEW.quote_number IS NULL OR NEW.quote_number = '')
  EXECUTE FUNCTION generate_quote_number();

-- =============================================================================
-- SECTION 9: CONTACT FORMS & NOTIFICATIONS
-- =============================================================================

CREATE TABLE public.contact_submissions (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID            REFERENCES public.users(id) ON DELETE SET NULL,
  inquiry_type        TEXT            NOT NULL DEFAULT 'general'
                                      CHECK (inquiry_type IN ('general','quote','support','other')),
  first_name          TEXT            NOT NULL,
  last_name           TEXT            NOT NULL,
  email               CITEXT          NOT NULL,
  phone               TEXT,
  company_name        TEXT,
  subject             TEXT,
  message             TEXT            NOT NULL,
  species_interest    TEXT,           -- pre-filled from URL param
  product_interest    TEXT,           -- pre-filled from URL param
  status              TEXT            NOT NULL DEFAULT 'new'
                                      CHECK (status IN ('new','read','replied','closed')),
  assigned_to         UUID            REFERENCES public.users(id),
  ip_address          INET,
  submitted_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Door launch notification signups
CREATE TABLE public.notify_signups (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  email               CITEXT          NOT NULL UNIQUE,
  product_interest    TEXT,           -- 'doors' | specific product
  source_page         TEXT,           -- which page they signed up from
  signed_up_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  notified_at         TIMESTAMPTZ     -- when we actually sent them the notification
);

-- =============================================================================
-- SECTION 10: PROMO CODES & DISCOUNTS
-- =============================================================================

CREATE TABLE public.promo_codes (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  code                TEXT            NOT NULL UNIQUE,
  description         TEXT,
  discount_type       TEXT            NOT NULL CHECK (discount_type IN ('percent','fixed')),
  discount_value      NUMERIC(10,2)   NOT NULL,
  min_order_total     NUMERIC(10,2),
  max_uses            INTEGER,        -- NULL = unlimited
  times_used          INTEGER         NOT NULL DEFAULT 0,
  valid_from          TIMESTAMPTZ,
  valid_until         TIMESTAMPTZ,
  account_types       TEXT[],         -- NULL = all types, or restrict to ['trade','distributor']
  is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
  created_by          UUID            REFERENCES public.users(id),
  created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- SECTION 11: ADMIN & CRM
-- =============================================================================

-- Internal notes on customers (CRM-lite)
CREATE TABLE public.customer_notes (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id         UUID            NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  author_id           UUID            REFERENCES public.users(id),
  note                TEXT            NOT NULL,
  note_type           TEXT            DEFAULT 'general'
                                      CHECK (note_type IN (
                                        'general','call','email','meeting',
                                        'complaint','compliment','credit_review'
                                      )),
  created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Simple activity log for admin dashboard
CREATE TABLE public.activity_log (
  id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id            UUID            REFERENCES public.users(id),
  actor_type          TEXT            CHECK (actor_type IN ('customer','admin','system')),
  action              TEXT            NOT NULL, -- 'order.created' | 'trade.approved' | etc.
  entity_type         TEXT,           -- 'order' | 'user' | 'payment'
  entity_id           UUID,
  metadata            JSONB,
  ip_address          INET,
  occurred_at         TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- SECTION 12: INDEXES
-- =============================================================================

-- Users
CREATE INDEX idx_users_email          ON public.users(email);
CREATE INDEX idx_users_account_type   ON public.users(account_type);
CREATE INDEX idx_users_trade_approved ON public.users(trade_approved) WHERE trade_approved = TRUE;
CREATE INDEX idx_users_created_at     ON public.users(created_at DESC);

-- Products
CREATE INDEX idx_products_category    ON public.products(category_id);
CREATE INDEX idx_products_slug        ON public.products(slug);
CREATE INDEX idx_products_sku         ON public.products(sku);
CREATE INDEX idx_products_product_line ON public.products(product_line);
CREATE INDEX idx_products_species_code ON public.products(species_code) WHERE species_code IS NOT NULL;
CREATE INDEX idx_products_active      ON public.products(is_active, is_coming_soon);
CREATE INDEX idx_products_featured    ON public.products(is_featured) WHERE is_featured = TRUE;

-- Full text search on products
CREATE INDEX idx_products_fts ON public.products
  USING gin(to_tsvector('english', name || ' ' || COALESCE(description,'') ||
    ' ' || COALESCE(species_name,'') || ' ' || COALESCE(material,'')));

-- Orders
CREATE INDEX idx_orders_user          ON public.orders(user_id);
CREATE INDEX idx_orders_status        ON public.orders(status);
CREATE INDEX idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX idx_orders_created_at    ON public.orders(created_at DESC);
CREATE INDEX idx_orders_number        ON public.orders(order_number);

-- Payments
CREATE INDEX idx_payments_order       ON public.payments(order_id);
CREATE INDEX idx_payments_stripe_pi   ON public.payments(stripe_payment_intent_id)
  WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX idx_payments_status      ON public.payments(status);
CREATE INDEX idx_payments_ach_settlement ON public.payments(ach_settlement_date)
  WHERE ach_settlement_date IS NOT NULL;

-- Cart
CREATE INDEX idx_carts_user           ON public.carts(user_id);
CREATE INDEX idx_carts_session        ON public.carts(session_id);
CREATE INDEX idx_carts_status         ON public.carts(status);

-- Addresses
CREATE INDEX idx_addresses_user       ON public.addresses(user_id);

-- Quote requests
CREATE INDEX idx_quotes_user          ON public.quote_requests(user_id);
CREATE INDEX idx_quotes_status        ON public.quote_requests(status);
CREATE INDEX idx_quotes_species       ON public.quote_requests USING gin(species_codes);

-- Trade applications
CREATE INDEX idx_trade_apps_status    ON public.trade_applications(status);
CREATE INDEX idx_trade_apps_email     ON public.trade_applications(email);

-- Login audit
CREATE INDEX idx_login_audit_user     ON public.login_audit(user_id);
CREATE INDEX idx_login_audit_email    ON public.login_audit(email);
CREATE INDEX idx_login_audit_logged   ON public.login_audit(logged_at DESC);

-- Activity log
CREATE INDEX idx_activity_actor       ON public.activity_log(actor_id);
CREATE INDEX idx_activity_entity      ON public.activity_log(entity_type, entity_id);
CREATE INDEX idx_activity_occurred    ON public.activity_log(occurred_at DESC);

-- =============================================================================
-- SECTION 13: ROW LEVEL SECURITY (RLS)
-- Supabase uses RLS to enforce data access at the database level.
-- Customers can only see their own data.
-- Admins can see everything.
-- =============================================================================

ALTER TABLE public.users                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_payment_methods  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_notes         ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own record
CREATE POLICY users_self_read ON public.users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY users_self_update ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can do everything on users
CREATE POLICY users_admin_all ON public.users
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.account_type = 'admin')
  );

-- Addresses: own only
CREATE POLICY addresses_own ON public.addresses
  FOR ALL USING (auth.uid() = user_id);

-- Carts: own only
CREATE POLICY carts_own ON public.carts
  FOR ALL USING (auth.uid() = user_id);

-- Orders: own only (customers), all (admins)
CREATE POLICY orders_own ON public.orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY orders_admin ON public.orders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.account_type IN ('admin','sales_rep'))
  );

-- Payments: own only
CREATE POLICY payments_own ON public.payments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid())
  );

-- Saved payment methods: own only
CREATE POLICY saved_pm_own ON public.saved_payment_methods
  FOR ALL USING (auth.uid() = user_id);

-- Quote requests: own only
CREATE POLICY quotes_own ON public.quote_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Products are public read
ALTER TABLE public.products               ENABLE ROW LEVEL SECURITY;
CREATE POLICY products_public_read ON public.products
  FOR SELECT USING (is_active = TRUE);
CREATE POLICY products_admin_all ON public.products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.account_type = 'admin')
  );

-- =============================================================================
-- SECTION 14: UPDATED_AT TRIGGERS
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_carts_updated_at
  BEFORE UPDATE ON public.carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_trade_apps_updated_at
  BEFORE UPDATE ON public.trade_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_quotes_updated_at
  BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- SECTION 15: SEED DATA — Product Categories
-- =============================================================================

INSERT INTO public.product_categories (slug, name, product_line, display_order) VALUES
  ('crown-moulding',      'Crown Moulding',           'moulding_trim',     1),
  ('baseboards',          'Baseboards & Skirting',    'moulding_trim',     2),
  ('door-casing',         'Door & Window Casing',     'moulding_trim',     3),
  ('door-frames',         'Door Frames',              'moulding_trim',     4),
  ('wall-panels',         'Wall Panels',              'moulding_trim',     5),
  ('stair-parts',         'Stair Parts',              'moulding_trim',     6),
  ('boards',              'S3S / S4S Boards',         'moulding_trim',     7),
  ('quarter-round',       'Quarter Round',            'moulding_trim',     8),
  ('shutters',            'Shutters',                 'moulding_trim',     9),
  ('tropical-hardwood',   'Tropical Hardwood',        'tropical_hardwood', 10),
  ('doors',               'Doors',                    'doors',             11);

UPDATE public.product_categories SET is_coming_soon = TRUE WHERE slug = 'doors';
