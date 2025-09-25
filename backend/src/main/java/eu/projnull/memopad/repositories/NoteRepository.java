package eu.projnull.memopad.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.Repository;

import eu.projnull.memopad.models.Folder;
import eu.projnull.memopad.models.Note;

public interface NoteRepository extends Repository<Note, Long> {
    Note save(Note note);
    void delete(Note note);
    Optional<Note> findById(long id);
    List<Note> findByFolder(Folder folder);
    void deleteByFolder(Folder folder);
}
