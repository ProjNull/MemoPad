package eu.projnull.memopad.controllers.dto;

import eu.projnull.memopad.models.Note;
import lombok.Data;

@Data
public class NoteResponse {
    private Long id;
    private String title;
    private String content;
    private Long folderId;
    private Long ownerId;
    public NoteResponse(Note note) {
        this.id = note.getId();
        this.title = note.getName();
        this.content = note.getContent();
        this.folderId = note.getFolder().getId();
        this.ownerId = note.getFolder().getOwnerId();
    }
}
