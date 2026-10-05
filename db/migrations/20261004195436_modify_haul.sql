-- migrate:up
ALTER TABLE hauls ADD COLUMN language TEXT;
ALTER TABLE hauls ADD COLUMN title TEXT;
ALTER TABLE hauls ADD COLUMN assistant TEXT;
ALTER TABLE hauls ADD COLUMN assistant_model TEXT;

-- migrate:down

