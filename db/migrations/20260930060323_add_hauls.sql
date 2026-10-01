-- migrate:up
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
);

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

-- migrate:down

