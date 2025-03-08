package eu.projnull.memopad.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eu.projnull.memopad.controllers.dto.NoteContentUpdate;
import eu.projnull.memopad.controllers.dto.NoteCreate;
import eu.projnull.memopad.controllers.dto.NoteFolderUpdate;
import eu.projnull.memopad.controllers.dto.NoteNameUpdate;
import eu.projnull.memopad.controllers.dto.NoteResponse;
import eu.projnull.memopad.models.Folder;
import eu.projnull.memopad.models.Note;
import eu.projnull.memopad.services.FolderService;
import eu.projnull.memopad.services.NoteService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/notes")
public class NoteController {
    private final NoteService noteService;
    private final FolderService folderService;

    public NoteController(NoteService noteService, FolderService folderService) {
        this.noteService = noteService;
        this.folderService = folderService;
    }

    /**
     * Creates a new note in the given folder with the given name and content.
     *
     * @param noteCreate the note to create
     * @return the created note response
     */
    @PostMapping("/create")
    public NoteResponse createNote(@RequestBody NoteCreate noteCreate) {
        // TODO: Actually get current user
        long userId = 1;

        long folderId = noteCreate.getFolderId();
        String name = noteCreate.getName();
        String content = noteCreate.getContent();

        Folder folder = folderService.getFolder(userId, folderId);
        Note note = noteService.createNote(userId, name, content == null ? "# " + name : content, folder);
        return new NoteResponse(note);
    }

    /**
     * Retrieves a note by its ID.
     * 
     * @param id the ID of the note to retrieve
     * @return the note response if found, or null if the note does not exist or
     *         does not belong to the user
     */
    @GetMapping("/{id}")
    public NoteResponse get(@PathVariable Long id) {
        // TODO: Actually get current user
        long userId = 1;
        return new NoteResponse(noteService.getNote(userId, id));
    }

    /**
     * Moves a note to a new folder.
     * 
     * @param id      the ID of the note to move
     * @param noteFolderUpdate the folder to move the note to
     * @return the moved note
     */
    @PostMapping("/{id}/move")
    public NoteResponse moveNote(@PathVariable Long id, @RequestBody NoteFolderUpdate noteFolderUpdate) {
        // TODO: Actually get current user
        long userId = 1;
        long folderId = noteFolderUpdate.getFolderId();
        Folder folder = folderService.getFolder(userId, folderId);
        Note note = noteService.getNote(userId, id);
        noteService.moveNote(userId, note, folder);
        return new NoteResponse(note);
    }

    /**
     * Renames a note to a new name. The note's ID is in the path and the new
     * name is in the request body.
     * 
     * @param id      the ID of the note to rename
     * @param noteNameUpdate the new name of the note
     * @return the renamed note response
     */

    @PostMapping("/{id}/rename")
    public NoteResponse renameNote(@PathVariable Long id, @RequestBody NoteNameUpdate noteNameUpdate) {
        // TODO: Actually get current user
        long userId = 1;
        String newName = noteNameUpdate.getName();
        Note note = noteService.getNote(userId, id);
        Note renamedNote = noteService.renameNote(userId, note, newName);
        return new NoteResponse(renamedNote);
    }

    /**
     * Deletes a note.
     *
     * @param id the ID of the note to delete
     * @return "deleted"
     */
    @DeleteMapping("/{id}/delete")
    public String deleteNote(@PathVariable Long id) {
        // TODO: Actually get current user
        long userId = 1;
        Note note = noteService.getNote(userId, id);
        noteService.deleteNote(userId, note);
        return "deleted";
    }

    /**
     * Updates the content of a note.
     *
     * @param id      the ID of the note to update
     * @param noteContentUpdate the new content of the note
     * @return the updated note response
     */
    @PostMapping("/{id}/content")
    public NoteResponse updateContent(@PathVariable Long id, @RequestBody NoteContentUpdate noteContentUpdate) {
        // TODO: Actually get current user
        long userId = 1;
        String content = noteContentUpdate.getContent();
        Note note = noteService.getNote(userId, id);
        Note updatedNote = noteService.updateNoteContent(userId, note, content);
        return new NoteResponse(updatedNote);
    }
}

