package eu.projnull.memopad.services;

import java.util.List;
import java.util.Optional;

import eu.projnull.memopad.services.exceptions.NoteDoesntBelongToUser;
import eu.projnull.memopad.services.exceptions.NoteNotFound;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import eu.projnull.memopad.models.Folder;
import eu.projnull.memopad.models.Note;
import eu.projnull.memopad.repositories.NoteRepository;

@Service
public class NoteService {
    private final NoteRepository noteRepository;
    public NoteService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }
    
    public Note createNote(long ownerId, String name, String content, Folder folder) {
        Note note = new Note();
        note.setName(name);
        note.setContent(content);
        note.setFolder(folder);
        return noteRepository.save(note);
    }

    public void deleteNote(long ownerId, Note note) throws NoteDoesntBelongToUser {
        if (note.getFolder().getOwnerId() != ownerId) throw new NoteDoesntBelongToUser("This note doesn't belong to you!");
        noteRepository.delete(note);
    }

    public Note renameNote(long ownerId, Note note, String newName) throws NoteDoesntBelongToUser {
        if (note.getFolder().getOwnerId() != ownerId) throw new NoteDoesntBelongToUser("This note doesn't belong to you!");
        note.setName(newName);
        return noteRepository.save(note);
    }

    public void moveNote(long ownerId, Note note, Folder newFolder) throws NoteDoesntBelongToUser {
        if (note.getFolder().getOwnerId() != ownerId) throw new NoteDoesntBelongToUser("This note doesn't belong to you!");
        note.setFolder(newFolder);
        noteRepository.save(note);
    }

    public @Nullable Note getNote(long ownerId, long noteId) throws NoteDoesntBelongToUser {
        Optional<Note> noteOptional = noteRepository.findById(noteId);
        if (noteOptional.isEmpty()) {
            throw new NoteNotFound("Note with ID " +  noteId + " not found!");
        }
        if (noteOptional.get().getFolder().getOwnerId() != ownerId) throw new NoteDoesntBelongToUser("This note doesn't belong to you!");
        return noteOptional.get();
    }

    public Note updateNoteContent(long ownerId, Note note, String content) {
        note.setContent(content);
        return noteRepository.save(note);
    }

    public List<Note> getNotesInFolder(long ownerId, Folder folder) {
        return noteRepository.findByFolder(folder);
    }

    public void deleteNotesInFolder(long ownerId, Folder folder) {
        noteRepository.deleteByFolder(folder);
    }
}
