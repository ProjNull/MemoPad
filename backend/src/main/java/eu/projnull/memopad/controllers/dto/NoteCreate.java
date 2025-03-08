package eu.projnull.memopad.controllers.dto;

import org.springframework.lang.Nullable;

import lombok.Data;

@Data
public class NoteCreate {
    private Long folderId;
    private String name;
    private @Nullable String content;
}
