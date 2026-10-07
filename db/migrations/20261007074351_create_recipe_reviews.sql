-- migrate:up
CREATE TABLE recipe_reviews (
    user_id         TEXT      NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    recipe_id       TEXT      NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
    rating          INTEGER   NOT NULL CHECK (rating BETWEEN 1 AND 3),
    children_rating INTEGER   CHECK (children_rating BETWEEN 1 AND 3),
    notes           TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, recipe_id)
);

CREATE INDEX idx_recipe_reviews_recipe_id ON recipe_reviews (recipe_id);


-- migrate:down

