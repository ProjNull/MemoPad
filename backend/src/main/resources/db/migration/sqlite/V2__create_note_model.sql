CREATE TABLE note (
    id NUMBER PRIMARY KEY,
    folder_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    content TEXT DEFAULT '',
    FOREIGN KEY (folder_id) REFERENCES folder(id)
)
