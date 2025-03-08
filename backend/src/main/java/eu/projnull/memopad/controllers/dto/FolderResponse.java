package eu.projnull.memopad.controllers.dto;

import org.springframework.lang.Nullable;

import eu.projnull.memopad.models.Folder;
import lombok.Data;

@Data
public class FolderResponse {
    public FolderResponse(Folder folder) {
        this.id = folder.getId();
        this.name = folder.getName();
        this.parentId = folder.getParentFolder() == null ? null : folder.getParentFolder().getId();
        this.ownerId = folder.getOwnerId();
        this.subFolderIds = folder.getSubFolders().stream().map(Folder::getId).toArray(Long[]::new);
    }

    private Long id;
    private String name;
    private @Nullable Long parentId;
    private Long ownerId;
    private Long[] subFolderIds;
}
