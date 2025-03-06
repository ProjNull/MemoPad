package eu.projnull.memopad.repositories;

import java.util.List;

import org.springframework.data.repository.Repository;

import eu.projnull.memopad.models.Folder;
import eu.projnull.memopad.models.Note;

public interface NoteRepository extends Repository<Note, Long> {
    void save(Note note);
    void delete(Note note);
    List<Note> findByFolder(Folder folder);
}
