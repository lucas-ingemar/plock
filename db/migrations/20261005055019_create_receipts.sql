-- migrate:up
-- Requires: PRAGMA foreign_keys = ON; (set per connection, e.g. ?_foreign_keys=on in the DSN)

CREATE TABLE receipts (
    id            TEXT    NOT NULL PRIMARY KEY,               -- uuid.UUID (string form)
    haul_id       TEXT    NOT NULL REFERENCES hauls (id) ON DELETE CASCADE,
    currency      TEXT    NOT NULL, -- ISO 4217, e.g. SEK
    date          TEXT    NOT NULL,                            -- YYYY-MM-DD
    item_count    INTEGER NOT NULL CHECK (item_count >= 0),
    store         TEXT    NOT NULL,
    summary       TEXT    NOT NULL,
    total         REAL    NOT NULL,
    total_savings REAL             CHECK (total_savings IS NULL OR total_savings >= 0),
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_receipts_date  ON receipts (date);
CREATE INDEX idx_receipts_store ON receipts (store);

CREATE TABLE receipt_items (
    id         TEXT    NOT NULL PRIMARY KEY,                   -- uuid.UUID (string form)
    receipt_id TEXT    NOT NULL REFERENCES receipts (id) ON DELETE CASCADE,
    idx        INTEGER NOT NULL CHECK (idx >= 0),              -- position in Receipt.Items
    brand      TEXT,
    category   TEXT,
    discount   REAL             CHECK (discount IS NULL OR discount >= 0),
    is_food    INTEGER NOT NULL CHECK (is_food IN (0, 1)),
    name       TEXT    NOT NULL,
    price      REAL    NOT NULL,
    quantity   REAL    NOT NULL,
    unit       TEXT    NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (receipt_id, idx)  -- also serves as the index for WHERE receipt_id = ? ORDER BY idx
);

CREATE INDEX idx_receipt_items_category ON receipt_items (category);

-- migrate:down

