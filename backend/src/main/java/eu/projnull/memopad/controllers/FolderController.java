package eu.projnull.memopad.controllers;

import eu.projnull.memopad.controllers.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RestController;

import eu.projnull.memopad.models.Folder;
import eu.projnull.memopad.models.Note;
import eu.projnull.memopad.models.User;
import eu.projnull.memopad.services.FolderService;
import eu.projnull.memopad.services.NoteService;

import java.util.List;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/folders")
public class FolderController {
    private final FolderService folderService;
    private final NoteService noteService;

    public FolderController(FolderService folderService, NoteService noteService) {
        this.folderService = folderService;
        this.noteService = noteService;
    }

    /**
     * Retrieves the root folder.
     *
     * @return the root folder
     */
    @GetMapping("/")
    @Operation(summary = "Returns the user's root/main folder.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Returns the user's root folder."), 
        @ApiResponse(responseCode = "403", description = "Invalid session (filtered before reaching this endpoint)")
    })
    public FolderResponse getRoot() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        long userId = user.getId();
        Folder folder = folderService.getRootFolder(userId);
        List<Long> notes = noteService.getNotesInFolder(userId, folder).stream().map(Note::getId).toList();
        return new FolderResponse(folder, notes);
    }

    /**
     * Retrieves a folder by its ID.
     *
     * @param id the ID of the folder to retrieve
     * @return the folder response if found, or null if the folder does not exist or
     *         does not belong to the user
     */
    @GetMapping("/{id}")
    @Operation(summary = "Returns information about the specified folder.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Returns the specified folder."), 
        @ApiResponse(responseCode = "404", description = "Folder not found."),
        @ApiResponse(responseCode = "403", description = "Invalid session or folder belongs to another user.")
    })
    public FolderResponse getFolder(@PathVariable(value = "id") Long id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        long userId = user.getId();
        Folder folder = folderService.getFolder(userId, id);
        List<Long> notes = noteService.getNotesInFolder(userId, folder).stream().map(Note::getId).toList();
        return new FolderResponse(folder, notes);
    }

    /**
     * Creates a new folder in the given folder.
     *
     * @param id   the ID of the folder to create the child in
     * @param folderCreate the folder to create
     * @return the created folder
     */
    @PostMapping("/{id}/create")
    @Operation(summary = "Creates a new child folder within the specified parent folder (id param)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Returns the newly created folder."), 
        @ApiResponse(responseCode = "404", description = "Folder not found."),
        @ApiResponse(responseCode = "403", description = "Invalid session or folder belongs to another user.")
    })
    public FolderResponse createChild(@PathVariable(value = "id") Long id, @RequestBody FolderCreate folderCreate) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        long userId = user.getId();
        String name = folderCreate.getName();
        Folder parentFolder = folderService.getFolder(userId, id);
        Folder folder = folderService.createFolder(userId, name, parentFolder);
        List<Long> notes = noteService.getNotesInFolder(userId, folder).stream().map(Note::getId).toList();
        return new FolderResponse(folder, notes);
    }

    /**
     * Deletes a folder.
     *
     * @param id the ID of the folder to delete
     * @return "deleted"
     */
    @DeleteMapping("/{id}/delete")
    @Operation(summary = "Deletes the specified parent folder (id param)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Returns the user's root folder."), 
        @ApiResponse(responseCode = "400", description = "Bad body or specified folder is root."),
        @ApiResponse(responseCode = "404", description = "Folder not found."),
        @ApiResponse(responseCode = "403", description = "Invalid session or folder belongs to another user.")
    })
    public GenericMessageResponse deleteFolder(@PathVariable(value = "id") Long id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        long userId = user.getId();
        Folder folder = folderService.getFolder(userId, id);
        if (folder.getId().equals(folderService.getRootFolder(userId).getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot delete root folder");
        }
        folderService.deleteFolder(userId, folder);
        noteService.deleteNotesInFolder(userId, folder);
        return new GenericMessageResponse("Folder deleted.");
    }

    /**
     * Renames a folder to a new name. The folder's ID is in the path and the new
     * name is in the request body.
     * 
     * @param id      the ID of the folder to rename
     * @param folderNameUpdate the new name of the folder
     * @return the renamed folder
     */
    @PostMapping("/{id}/rename")
    @Operation(summary = "Renames the specified folder (param id) to the new name given in request body.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Returns the modified folder."), 
        @ApiResponse(responseCode = "404", description = "Folder not found."),
        @ApiResponse(responseCode = "403", description = "Invalid session or folder belongs to another user.")
    })
    public FolderResponse renameFolder(@PathVariable(value = "id") Long id, @RequestBody FolderNameUpdate folderNameUpdate) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        long userId = user.getId();
        String newName = folderNameUpdate.getName();
        Folder folder = folderService.getFolder(userId, id);
        Folder renamedFolder = folderService.renameFolder(userId, folder, newName);
        List<Long> notes = noteService.getNotesInFolder(userId, folder).stream().map(Note::getId).toList();
        return new FolderResponse(renamedFolder, notes);
    }

    /**
     * Moves a folder to another folder.
     *
     * @param id       the ID of the folder to move
     * @param parentId the ID of the folder to move the folder to
     * @return the moved folder
     */
    @PostMapping("/{id}/move/{parentId}")
    @Operation(summary = "Changes the parent of a specified folder (first id param) to the new parent folder (second id param).")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Returns the modified folder."), 
        @ApiResponse(responseCode = "404", description = "Folder not found."),
        @ApiResponse(responseCode = "403", description = "Invalid session or folder belongs to another user.")
    })
    public FolderResponse moveFolder(@PathVariable(value = "id") Long id, @PathVariable(value = "parentId") Long parentId) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        long userId = user.getId();
        Folder folder = folderService.getFolder(userId, id);
        Folder parentFolder = folderService.getFolder(userId, parentId);
        folderService.moveFolder(userId, folder, parentFolder);
        List<Long> notes = noteService.getNotesInFolder(userId, folder).stream().map(Note::getId).toList();
        return new FolderResponse(folder, notes);
    }

    /**
     * Retrieves all files (notes) in a folder.
     * 
     * @param id the ID of the folder to retrieve files from
     * @return a list of the notes in the folder
     */
    @GetMapping("/{id}/files")
    @Operation(summary = "Returns a list of notes in the specified folder (param id)")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Returns an array of files in the specified folder."), 
        @ApiResponse(responseCode = "404", description = "Folder not found."),
        @ApiResponse(responseCode = "403", description = "Invalid session or folder belongs to another user.")
    })
    public List<NoteResponse> getFiles(@PathVariable(value = "id") Long id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        long userId = user.getId();
        Folder folder = folderService.getFolder(userId, id);
        return noteService.getNotesInFolder(userId, folder).stream().map(NoteResponse::new).toList();
    }

    /**
     * Retrieves all subfolders in a folder.
     *
     * @param id the ID of the folder to retrieve subfolders from
     * @return a list of the subfolders in the folder
     */
    @GetMapping("/{id}/folders")
    @Operation(summary = "Returns a list of subfolders in a given folder (param id).")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Returns an array of folders in the specified folder."), 
        @ApiResponse(responseCode = "404", description = "Folder not found."),
        @ApiResponse(responseCode = "403", description = "Invalid session or folder belongs to another user.")
    })
    public List<FolderResponse> getFolders(@PathVariable(value = "id") Long id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        long userId = user.getId();
        Folder folder = folderService.getFolder(userId, id);
        return folder.getSubFolders().stream().map(f -> {
            List<Long> notes = noteService.getNotesInFolder(userId, f).stream().map(Note::getId).toList();
            return new FolderResponse(f, notes);
        }).toList();
    }

}
