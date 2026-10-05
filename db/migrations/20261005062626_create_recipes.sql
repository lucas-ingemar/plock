-- migrate:up
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

-- migrate:down

