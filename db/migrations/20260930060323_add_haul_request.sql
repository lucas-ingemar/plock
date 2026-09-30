-- migrate:up
CREATE TABLE haul_requests (
    id                  TEXT      PRIMARY KEY,
    adults              INTEGER   NOT NULL CHECK (adults BETWEEN 1 AND 10),
    children            INTEGER   NOT NULL CHECK (children BETWEEN 0 AND 10),
    servings_per_meal   INTEGER   NOT NULL CHECK (servings_per_meal BETWEEN 1 AND 8),
    meal_count          INTEGER   NOT NULL CHECK (meal_count BETWEEN 2 AND 7),
    max_cooking_minutes INTEGER   NOT NULL CHECK (max_cooking_minutes IN (20, 30, 45, 60)),
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE haul_request_proteins (
    haul_request_id TEXT NOT NULL REFERENCES haul_requests (id) ON DELETE CASCADE,
    protein         TEXT NOT NULL,
    PRIMARY KEY (haul_request_id, protein)
) STRICT, WITHOUT ROWID;

CREATE TABLE haul_request_cuisines (
    haul_request_id TEXT NOT NULL REFERENCES haul_requests (id) ON DELETE CASCADE,
    cuisine         TEXT NOT NULL,
    PRIMARY KEY (haul_request_id, cuisine)
) STRICT, WITHOUT ROWID;

CREATE INDEX idx_haul_requests_created_at ON haul_requests (created_at);

-- migrate:down

