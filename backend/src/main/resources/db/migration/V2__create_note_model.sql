CREATE TABLE note (
    id SERIAL PRIMARY KEY,
    folder_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    content TEXT DEFAULT '',
    FOREIGN KEY (folder_id) REFERENCES folder(id)
)

