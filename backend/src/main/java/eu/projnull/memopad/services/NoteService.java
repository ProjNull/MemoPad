package eu.projnull.memopad.services;

import java.util.List;

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

    public void deleteNote(long ownerId, Note note) {
        noteRepository.delete(note);
    }

    public Note renameNote(long ownerId, Note note, String newName) {
        note.setName(newName);
        return noteRepository.save(note);
    }

    public Note moveNote(long ownerId, Note note, Folder newFolder) {
        note.setFolder(newFolder);
        return noteRepository.save(note);
    }

    public @Nullable Note getNote(long ownerId, long noteId) {
        return noteRepository.findById(noteId).orElse(null);
    }

    public Note updateNoteContent(long ownerId, Note note, String content) {
        note.setContent(content);
        return noteRepository.save(note);
    }

    public List<Note> getNotesInFolder(long ownerId, Folder folder) {
        return noteRepository.findByFolder(folder);
    }
}
