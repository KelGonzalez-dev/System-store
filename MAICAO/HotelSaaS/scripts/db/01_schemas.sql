-- ============================================================
-- Hotel SaaS - PostgreSQL Schema Setup
-- Run this FIRST before starting the API
-- ============================================================

-- Schemas
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS booking;
CREATE SCHEMA IF NOT EXISTS finance;
CREATE SCHEMA IF NOT EXISTS audit;
CREATE SCHEMA IF NOT EXISTS cache;
CREATE SCHEMA IF NOT EXISTS security;

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ULID generation helper
CREATE OR REPLACE FUNCTION core.generate_ulid() RETURNS TEXT AS $$
DECLARE
  ts BIGINT;
  rand_bytes BYTEA;
  base32_chars TEXT := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  result TEXT := '';
  i INT;
  val BIGINT;
BEGIN
  ts := FLOOR(EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT;
  rand_bytes := gen_random_bytes(10);
  -- Timestamp part (10 chars)
  FOR i IN REVERSE 9..0 LOOP
    result := result || substr(base32_chars, (ts % 32)::INT + 1, 1);
    ts := ts >> 5;
  END LOOP;
  result := reverse(result);
  -- Randomness part (16 chars)
  val := 0;
  FOR i IN 0..9 LOOP
    val := val * 256 + get_byte(rand_bytes, i);
  END LOOP;
  FOR i IN REVERSE 15..0 LOOP
    result := result || substr(base32_chars, (val % 32)::INT + 1, 1);
    val := val >> 5;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- ── security.users ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS security.users (
    id             TEXT        PRIMARY KEY DEFAULT core.generate_ulid(),
    hotel_id       TEXT,
    email          TEXT        NOT NULL UNIQUE,
    password_hash  TEXT        NOT NULL,
    first_name     TEXT        NOT NULL,
    last_name      TEXT        NOT NULL,
    role           TEXT        NOT NULL DEFAULT 'Staff',
    status         TEXT        NOT NULL DEFAULT 'Active',
    refresh_token  TEXT,
    refresh_token_expiry TIMESTAMPTZ,
    last_login_at  TIMESTAMPTZ,
    failed_login_attempts INT NOT NULL DEFAULT 0,
    locked_until   TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── core.hotels ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS core.hotels (
    id             TEXT        PRIMARY KEY DEFAULT core.generate_ulid(),
    tenant_id      TEXT        NOT NULL,
    name           TEXT        NOT NULL,
    slug           TEXT        NOT NULL UNIQUE,
    description    TEXT,
    address        TEXT,
    city           TEXT,
    country        TEXT,
    phone          TEXT,
    email          TEXT,
    website        TEXT,
    star_rating    INT         NOT NULL DEFAULT 3,
    logo_url       TEXT,
    cover_image_url TEXT,
    currency       TEXT        NOT NULL DEFAULT 'USD',
    timezone       TEXT        NOT NULL DEFAULT 'UTC',
    check_in_time  TIME        NOT NULL DEFAULT '14:00',
    check_out_time TIME        NOT NULL DEFAULT '12:00',
    status         TEXT        NOT NULL DEFAULT 'Active',
    settings       JSONB,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── core.room_types ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS core.room_types (
    id                TEXT    PRIMARY KEY DEFAULT core.generate_ulid(),
    hotel_id          TEXT    NOT NULL REFERENCES core.hotels(id),
    name              TEXT    NOT NULL,
    description       TEXT,
    max_occupancy     INT     NOT NULL DEFAULT 2,
    max_adults        INT     NOT NULL DEFAULT 2,
    max_children      INT     NOT NULL DEFAULT 0,
    base_price        DECIMAL(10,2) NOT NULL,
    weekend_price     DECIMAL(10,2),
    size_m2           INT,
    bed_configuration TEXT    NOT NULL DEFAULT 'Double',
    amenities         JSONB   NOT NULL DEFAULT '[]',
    images            JSONB   NOT NULL DEFAULT '[]',
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── core.rooms ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS core.rooms (
    id                 TEXT    PRIMARY KEY DEFAULT core.generate_ulid(),
    hotel_id           TEXT    NOT NULL REFERENCES core.hotels(id),
    room_type_id       TEXT    NOT NULL REFERENCES core.room_types(id),
    number             TEXT    NOT NULL,
    floor              INT     NOT NULL DEFAULT 1,
    status             TEXT    NOT NULL DEFAULT 'Available',
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    notes              TEXT,
    maintenance_reason TEXT,
    housekeeping_status TEXT,
    last_cleaned_by    TEXT,
    last_cleaned_at    TIMESTAMPTZ,
    version            BIGINT  NOT NULL DEFAULT 0,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (hotel_id, number)
);

-- ── core.guests ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS core.guests (
    id              TEXT    PRIMARY KEY DEFAULT core.generate_ulid(),
    hotel_id        TEXT    NOT NULL REFERENCES core.hotels(id),
    first_name      TEXT    NOT NULL,
    last_name       TEXT    NOT NULL,
    email           TEXT    NOT NULL,
    phone           TEXT,
    country_code    TEXT,
    document_type   TEXT    NOT NULL DEFAULT 'Passport',
    document_number TEXT,
    date_of_birth   DATE,
    nationality     TEXT,
    address         TEXT,
    city            TEXT,
    notes           TEXT,
    status          TEXT    NOT NULL DEFAULT 'Active',
    total_stays     INT     NOT NULL DEFAULT 0,
    total_spent     DECIMAL(12,2) NOT NULL DEFAULT 0,
    loyalty_level   TEXT,
    marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_guests_hotel_email ON core.guests(hotel_id, lower(email));
CREATE INDEX IF NOT EXISTS idx_guests_hotel_doc ON core.guests(hotel_id, document_number);
CREATE INDEX IF NOT EXISTS idx_guests_name_trgm ON core.guests USING GIN (
    (first_name || ' ' || last_name) gin_trgm_ops
);

-- ── booking.reservations ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS booking.reservations (
    id                  TEXT    PRIMARY KEY DEFAULT core.generate_ulid(),
    hotel_id            TEXT    NOT NULL REFERENCES core.hotels(id),
    room_id             TEXT    NOT NULL REFERENCES core.rooms(id),
    guest_id            TEXT    NOT NULL REFERENCES core.guests(id),
    user_id             TEXT,
    confirmation_number TEXT    NOT NULL UNIQUE,
    check_in_date       DATE    NOT NULL,
    check_out_date      DATE    NOT NULL,
    adults              INT     NOT NULL DEFAULT 1,
    children            INT     NOT NULL DEFAULT 0,
    status              TEXT    NOT NULL DEFAULT 'Confirmed',
    base_amount         DECIMAL(10,2) NOT NULL,
    tax_amount          DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_amount        DECIMAL(10,2) NOT NULL,
    paid_amount         DECIMAL(10,2) NOT NULL DEFAULT 0,
    currency            TEXT    NOT NULL DEFAULT 'USD',
    source              TEXT,
    channel_code        TEXT,
    special_requests    TEXT,
    notes               TEXT,
    actual_check_in     TIMESTAMPTZ,
    actual_check_out    TIMESTAMPTZ,
    cancellation_reason TEXT,
    cancelled_at        TIMESTAMPTZ,
    cancelled_by        TEXT,
    version             BIGINT  NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_dates CHECK (check_out_date > check_in_date),
    CONSTRAINT chk_amounts CHECK (total_amount >= 0),
    -- GIST exclusion prevents double-bookings at DB level
    EXCLUDE USING GIST (
        room_id WITH =,
        daterange(check_in_date, check_out_date, '[)') WITH &&
    ) WHERE (status NOT IN ('Cancelled', 'NoShow'))
);
CREATE INDEX IF NOT EXISTS idx_reservations_hotel_dates
    ON booking.reservations(hotel_id, check_in_date, check_out_date);

-- ── booking.holds ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS booking.holds (
    id             TEXT    PRIMARY KEY DEFAULT core.generate_ulid(),
    hotel_id       TEXT    NOT NULL REFERENCES core.hotels(id),
    room_id        TEXT    NOT NULL REFERENCES core.rooms(id),
    guest_id       TEXT,
    user_id        TEXT,
    check_in_date  DATE    NOT NULL,
    check_out_date DATE    NOT NULL,
    status         TEXT    NOT NULL DEFAULT 'Active',
    expires_at     TIMESTAMPTZ NOT NULL,
    notes          TEXT,
    reservation_id TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── finance.payments ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS finance.payments (
    id               TEXT    PRIMARY KEY DEFAULT core.generate_ulid(),
    hotel_id         TEXT    NOT NULL REFERENCES core.hotels(id),
    reservation_id   TEXT    NOT NULL REFERENCES booking.reservations(id),
    guest_id         TEXT,
    idempotency_key  TEXT    NOT NULL UNIQUE,
    amount           DECIMAL(10,2) NOT NULL,
    refunded_amount  DECIMAL(10,2),
    currency         TEXT    NOT NULL DEFAULT 'USD',
    method           TEXT    NOT NULL,
    status           TEXT    NOT NULL DEFAULT 'Pending',
    transaction_id   TEXT,
    gateway          TEXT,
    gateway_response TEXT,
    notes            TEXT,
    processed_by     TEXT,
    processed_at     TIMESTAMPTZ,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS finance.payment_refunds (
    id           TEXT    PRIMARY KEY DEFAULT core.generate_ulid(),
    payment_id   TEXT    NOT NULL REFERENCES finance.payments(id),
    amount       DECIMAL(10,2) NOT NULL,
    reason       TEXT    NOT NULL,
    processed_by TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── audit.audit_logs ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit.audit_logs (
    id             TEXT    PRIMARY KEY DEFAULT core.generate_ulid(),
    hotel_id       TEXT,
    user_id        TEXT,
    user_email     TEXT,
    action         TEXT    NOT NULL,
    entity_type    TEXT    NOT NULL,
    entity_id      TEXT,
    old_values     JSONB,
    new_values     JSONB,
    ip_address     TEXT,
    user_agent     TEXT,
    correlation_id TEXT,
    trace_id       TEXT,
    success        BOOLEAN NOT NULL DEFAULT TRUE,
    error_message  TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_hotel_created ON audit.audit_logs(hotel_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit.audit_logs(entity_type, entity_id);

-- ── booking.fn_is_room_available ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION booking.fn_is_room_available(
    p_room_id TEXT,
    p_check_in DATE,
    p_check_out DATE
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM booking.reservations
        WHERE room_id = p_room_id
          AND status NOT IN ('Cancelled', 'NoShow')
          AND daterange(check_in_date, check_out_date, '[)') &&
              daterange(p_check_in, p_check_out, '[)')
    ) AND NOT EXISTS (
        SELECT 1 FROM booking.holds
        WHERE room_id = p_room_id
          AND status = 'Active'
          AND expires_at > NOW()
          AND daterange(check_in_date, check_out_date, '[)') &&
              daterange(p_check_in, p_check_out, '[)')
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- ── booking.fn_create_reservation ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION booking.fn_create_reservation(
    p_hotel_id        TEXT,
    p_room_id         TEXT,
    p_guest_id        TEXT,
    p_user_id         TEXT,
    p_check_in_date   DATE,
    p_check_out_date  DATE,
    p_adults          INT,
    p_children        INT,
    p_base_amount     DECIMAL,
    p_tax_amount      DECIMAL,
    p_total_amount    DECIMAL,
    p_currency        TEXT,
    p_source          TEXT,
    p_special_requests TEXT,
    p_notes           TEXT
) RETURNS TEXT AS $$
DECLARE
    v_id TEXT;
    v_conf TEXT;
BEGIN
    -- Validate availability (GIST will also enforce at INSERT)
    IF NOT booking.fn_is_room_available(p_room_id, p_check_in_date, p_check_out_date) THEN
        RAISE EXCEPTION 'Room % is not available from % to %', p_room_id, p_check_in_date, p_check_out_date
            USING ERRCODE = '23P01';
    END IF;

    v_id := core.generate_ulid();
    v_conf := 'HTL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
              UPPER(SUBSTRING(MD5(v_id) FROM 1 FOR 6));

    INSERT INTO booking.reservations (
        id, hotel_id, room_id, guest_id, user_id,
        confirmation_number, check_in_date, check_out_date,
        adults, children, status,
        base_amount, tax_amount, total_amount, paid_amount, currency,
        source, special_requests, notes,
        version, created_at, updated_at
    ) VALUES (
        v_id, p_hotel_id, p_room_id, p_guest_id, p_user_id,
        v_conf, p_check_in_date, p_check_out_date,
        p_adults, p_children, 'Confirmed',
        p_base_amount, p_tax_amount, p_total_amount, 0, COALESCE(p_currency, 'USD'),
        p_source, p_special_requests, p_notes,
        0, NOW(), NOW()
    );

    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- ── cache.fn_rebuild_availability ────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS cache;
CREATE OR REPLACE FUNCTION cache.fn_rebuild_availability(p_hotel_id TEXT)
RETURNS VOID AS $$
BEGIN
    -- In production this would refresh materialized views
    -- and clear Redis via pg_notify for the application to pick up
    PERFORM pg_notify('availability_changed', p_hotel_id);
    RAISE NOTICE 'Availability cache rebuild triggered for hotel %', p_hotel_id;
END;
$$ LANGUAGE plpgsql;

-- ── Seed: SuperAdmin user (password: Admin1234!) ──────────────────────────────
INSERT INTO security.users (id, email, password_hash, first_name, last_name, role, status)
VALUES (
    core.generate_ulid(),
    'superadmin@hotelsaas.io',
    -- BCrypt hash of 'Admin1234!'
    '\$2a\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4jGcS0.7JK',
    'Super', 'Admin', 'SuperAdmin', 'Active'
) ON CONFLICT (email) DO NOTHING;

-- ── Seed: Demo hotel ──────────────────────────────────────────────────────────
INSERT INTO core.hotels (id, tenant_id, name, slug, city, country, star_rating, currency)
VALUES (
    '01HZXXXXXXXXXXXXXXXXXXXXXXX',
    'tenant_demo',
    'Hotel Demo SaaS',
    'hotel-demo-saas',
    'Bogotá', 'CO', 5, 'COP'
) ON CONFLICT (slug) DO NOTHING;