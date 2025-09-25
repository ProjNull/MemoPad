ALTER TABLE note RENAME TO note_old;
ALTER TABLE folder RENAME TO folder_old;

CREATE TABLE folder (
    id INTEGER PRIMARY KEY,
    parent_id INTEGER,
    owner_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES folder(id) ON DELETE CASCADE
);

CREATE TABLE note (
    id INTEGER PRIMARY KEY,
    folder_id INTEGER,
    content TEXT,
    FOREIGN KEY (folder_id) REFERENCES folder(id) ON DELETE CASCADE
);

INSERT INTO folder (id, parent_id, owner_id, name)
SELECT id, parent_id, owner_id, name FROM folder_old;

INSERT INTO note (id, folder_id, content)
SELECT id, folder_id, content FROM note_old;

DROP TABLE folder_old;
DROP TABLE note_old;
