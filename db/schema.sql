CREATE TABLE IF NOT EXISTS "schema_migrations" (version varchar(128) primary key);
CREATE TABLE hauls (
    id                  TEXT      PRIMARY KEY,
    status              TEXT      NOT NULL,
    adults              INTEGER   NOT NULL,
    children            INTEGER   NOT NULL,
    servings_per_meal   INTEGER   NOT NULL,
    meal_count          INTEGER   NOT NULL,
    max_cooking_minutes INTEGER   NOT NULL,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
, language TEXT, title TEXT, assistant TEXT, assistant_model TEXT);
CREATE TABLE haul_proteins (
    haul_id TEXT NOT NULL REFERENCES hauls (id) ON DELETE CASCADE,
    protein         TEXT NOT NULL,
    PRIMARY KEY (haul_id, protein)
) STRICT, WITHOUT ROWID;
CREATE TABLE haul_cuisines (
    haul_id TEXT NOT NULL REFERENCES hauls (id) ON DELETE CASCADE,
    cuisine         TEXT NOT NULL,
    PRIMARY KEY (haul_id, cuisine)
) STRICT, WITHOUT ROWID;
CREATE INDEX idx_haul_created_at ON hauls (created_at);
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
CREATE TABLE recipes (
    id                 TEXT      NOT NULL PRIMARY KEY,           -- uuid.UUID (string form)
    haul_id            TEXT      NOT NULL REFERENCES hauls (id) ON DELETE CASCADE,
    haul_idx           INTEGER   NOT NULL CHECK (haul_idx >= 0), -- position among the haul's recipes
    cuisine            TEXT      NOT NULL,
    description        TEXT      NOT NULL,
    difficulty         TEXT      NOT NULL,
    kid_tips           TEXT,
    protein            TEXT      NOT NULL,
    servings           INTEGER   NOT NULL CHECK (servings > 0),
    title              TEXT      NOT NULL,
    total_time_minutes INTEGER   NOT NULL CHECK (total_time_minutes >= 0),
    created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (haul_id, haul_idx)  -- also serves as the index for WHERE haul_id = ? ORDER BY haul_idx
);
CREATE INDEX idx_recipes_cuisine ON recipes (cuisine);
CREATE INDEX idx_recipes_protein ON recipes (protein);
CREATE TABLE recipe_ingredients (
    id           TEXT      NOT NULL PRIMARY KEY,           -- uuid.UUID (string form)
    recipe_id    TEXT      NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
    idx          INTEGER   NOT NULL CHECK (idx >= 0),           -- position in Recipe.Ingredients
    from_receipt BOOLEAN   NOT NULL CHECK (from_receipt IN (0, 1)),
    name         TEXT      NOT NULL,
    note         TEXT,
    quantity     REAL               CHECK (quantity IS NULL OR quantity >= 0),
    unit         TEXT,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE recipe_steps (
    id            TEXT      NOT NULL PRIMARY KEY,           -- uuid.UUID (string form)
    recipe_id     TEXT      NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
    idx           INTEGER   NOT NULL CHECK (idx >= 0),          -- position in Recipe.Steps
    text          TEXT      NOT NULL,
    timer_minutes INTEGER            CHECK (timer_minutes IS NULL OR timer_minutes > 0),
    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Dbmate schema migrations
INSERT INTO "schema_migrations" (version) VALUES
  ('20260930060323'),
  ('20261004195436'),
  ('20261005055019'),
  ('20261005062626');
