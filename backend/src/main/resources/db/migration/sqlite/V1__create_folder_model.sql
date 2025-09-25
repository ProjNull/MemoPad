CREATE TABLE folder (
    id NUMBER PRIMARY KEY,
    parent_id INTEGER,
    owner_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES folder(id)
)
