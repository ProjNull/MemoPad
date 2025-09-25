ALTER TABLE note DROP CONSTRAINT note_folder_id_fkey;
ALTER TABLE note ADD CONSTRAINT note_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES folder(id) ON DELETE CASCADE;

ALTER TABLE folder DROP CONSTRAINT folder_parent_id_fkey;
ALTER TABLE folder ADD CONSTRAINT folder_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES folder(id) ON DELETE CASCADE;
