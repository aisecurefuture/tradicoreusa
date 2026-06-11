-- =============================================================================
-- TradiCore API — Migration 002
-- First Golden Logistics contact form submissions
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.fgl_contact_submissions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT        NOT NULL,
  company      TEXT        NOT NULL,
  email        CITEXT      NOT NULL,
  phone        TEXT,
  product_desc TEXT,
  ip_address   INET,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fgl_contacts_email    ON public.fgl_contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_fgl_contacts_submitted ON public.fgl_contact_submissions(submitted_at DESC);
