package eu.projnull.memopad.controllers;

import org.springframework.web.bind.annotation.RestController;

import eu.projnull.memopad.controllers.dto.FolderResponse;
import eu.projnull.memopad.models.Folder;
import eu.projnull.memopad.services.FolderService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/folders")
public class FolderController {
    private final FolderService folderService;

    public FolderController(FolderService folderService) {
        this.folderService = folderService;
    }

    /**
     * Retrieves the root folder.
     *
     * @return the root folder
     */
    @GetMapping("/")
    public FolderResponse getRoot() {
        // TODO: Actually get current user
        long userId = 1;
        Folder folder = folderService.getRootFolder(userId);
        return new FolderResponse(folder);
    }

    /**
     * Retrieves a folder by its ID.
     *
     * @param id the ID of the folder to retrieve
     * @return the folder response if found, or null if the folder does not exist or
     *         does not belong to the user
     */
    @GetMapping("/{id}")
    public FolderResponse getFolder(@PathVariable Long id) {
        // TODO: Actually get current user
        long userId = 1;
        try {
            Folder folder = folderService.getFolder(userId, id);
            return new FolderResponse(folder);
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

    /**
     * Creates a new folder in the given folder.
     *
     * @param id   the ID of the folder to create the child in
     * @param name the name of the folder to create
     * @return the created folder
     */
    @PostMapping("/{id}/create")
    public FolderResponse createChild(@PathVariable Long id, @RequestBody String name) {
        // TODO: Actually get current user
        long userId = 1;
        Folder parentFolder = folderService.getFolder(userId, id);
        Folder folder = folderService.createFolder(userId, name, parentFolder);
        return new FolderResponse(folder);
    }

    /**
     * Deletes a folder.
     *
     * @param id the ID of the folder to delete
     * @return "deleted"
     */
    @DeleteMapping("/{id}/delete")
    public String deleteFolder(@PathVariable Long id) {
        // TODO: Actually get current user
        long userId = 1;
        Folder folder = folderService.getFolder(userId, id);
        folderService.deleteFolder(userId, folder);
        return "deleted";
    }

    /**
     * Renames a folder to a new name. The folder's ID is in the path and the new
     * name is in the request body.
     * 
     * @param id      the ID of the folder to rename
     * @param newName the new name of the folder
     * @return the renamed folder
     */
    @PostMapping("/{id}/rename")
    public FolderResponse renameFolder(@PathVariable Long id, @RequestBody String newName) {
        // TODO: Actually get current user
        long userId = 1;
        Folder folder = folderService.getFolder(userId, id);
        Folder renamedFolder = folderService.renameFolder(userId, folder, newName);
        return new FolderResponse(renamedFolder);
    }

    /**
     * Moves a folder to another folder.
     *
     * @param id       the ID of the folder to move
     * @param parentId the ID of the folder to move the folder to
     * @return the moved folder
     */
    @PostMapping("/{id}/move/{parentId}")
    public FolderResponse moveFolder(@PathVariable Long id, @PathVariable Long parentId) {
        // TODO: Actually get current user
        long userId = 1;
        Folder folder = folderService.getFolder(userId, id);
        Folder parentFolder = folderService.getFolder(userId, parentId);
        folderService.moveFolder(userId, folder, parentFolder);
        return new FolderResponse(folder);
    }
}
