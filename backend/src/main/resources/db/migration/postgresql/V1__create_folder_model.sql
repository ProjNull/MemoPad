CREATE TABLE folder (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES folder(id),
    owner_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL
)
