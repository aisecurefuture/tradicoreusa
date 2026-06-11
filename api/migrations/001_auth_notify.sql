-- =============================================================================
-- TradiCore API — Migration 001
-- Standalone auth (no Supabase dependency) + notify_signups
-- Run once against your PostgreSQL database.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "citext";       -- case-insensitive text for emails
CREATE EXTENSION IF NOT EXISTS "pgcrypto";     -- gen_random_uuid(), gen_random_bytes()

-- ---------------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_users (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email             CITEXT      NOT NULL UNIQUE,
  password_hash     TEXT        NOT NULL,

  first_name        TEXT        NOT NULL,
  last_name         TEXT        NOT NULL,
  company_name      TEXT,
  phone             TEXT,
  title             TEXT,

  account_type      TEXT        NOT NULL DEFAULT 'retail'
                                CHECK (account_type IN ('retail','trade','distributor','admin')),
  trade_approved    BOOLEAN     NOT NULL DEFAULT FALSE,
  trade_approved_at TIMESTAMPTZ,

  marketing_opt_in  BOOLEAN     NOT NULL DEFAULT TRUE,
  is_active         BOOLEAN     NOT NULL DEFAULT TRUE,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_app_users_email        ON public.app_users(email);
CREATE INDEX IF NOT EXISTS idx_app_users_account_type ON public.app_users(account_type);
CREATE INDEX IF NOT EXISTS idx_app_users_created_at   ON public.app_users(created_at DESC);

-- ---------------------------------------------------------------------------
-- Password reset tokens
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
  token      TEXT        NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prt_token   ON public.password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_prt_user    ON public.password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_prt_expires ON public.password_reset_tokens(expires_at);

-- ---------------------------------------------------------------------------
-- Door / product launch notification signups
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notify_signups (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email            CITEXT      NOT NULL UNIQUE,
  product_interest TEXT,
  source_page      TEXT,
  signed_up_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notified_at      TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_notify_email ON public.notify_signups(email);

-- ---------------------------------------------------------------------------
-- updated_at trigger for app_users
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_app_users_updated_at ON public.app_users;
CREATE TRIGGER trg_app_users_updated_at
  BEFORE UPDATE ON public.app_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
