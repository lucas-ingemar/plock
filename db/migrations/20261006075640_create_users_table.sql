-- migrate:up
CREATE TABLE users (
    id         TEXT      PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id) VALUES ('00000000-0000-0000-0000-000000000000');



-- migrate:down

