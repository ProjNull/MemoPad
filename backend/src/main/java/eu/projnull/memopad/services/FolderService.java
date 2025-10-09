package eu.projnull.memopad.services;

import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import eu.projnull.memopad.models.Folder;
import eu.projnull.memopad.repositories.FolderRepository;
import eu.projnull.memopad.services.exceptions.FolderDoesntBelongToUser;
import eu.projnull.memopad.services.exceptions.FolderNotFound;

@Service
public class FolderService {
    private final FolderRepository folderRepository;
    public FolderService(FolderRepository folderRepository) {
        this.folderRepository = folderRepository;
    }

    public Folder createFolder(long ownerId, String name, @Nullable Folder parentFolder) {
        Folder folder = new Folder();
        folder.setOwnerId(ownerId);
        folder.setName(name);
        if (parentFolder != null) {
            folder.setParentFolder(parentFolder);
        }
        return folderRepository.save(folder);
    }

    public void deleteFolder(long ownerId, Folder folder) throws FolderDoesntBelongToUser {
        if (folder.getOwnerId() != ownerId) {
            throw new FolderDoesntBelongToUser("Folder does not belong to this user.");
        }
        folderRepository.delete(folder);
    }

    public Folder moveFolder(long ownerId, Folder folder, Folder newParentFolder) throws FolderDoesntBelongToUser {
        if (folder.getOwnerId() != ownerId) {
            throw new FolderDoesntBelongToUser("Folder does not belong to this user.");
        }
        // TODO: Check whether newParentFolder is a child of this folder or child of this folder's children 
        folder.setParentFolder(newParentFolder);
        return folderRepository.save(folder);
    }

    public Folder renameFolder(long ownerId, Folder folder, String newName) throws FolderDoesntBelongToUser {
        if (folder.getOwnerId() != ownerId) {
            throw new FolderDoesntBelongToUser("Folder does not belong to this user.");
        }
        folder.setName(newName);
        return folderRepository.save(folder);
    }

    public Folder getFolder(long ownerId, long folderId) throws FolderNotFound, FolderDoesntBelongToUser {
        Folder folder = folderRepository.findById(folderId).orElse(null);
        if (folder == null) {
            throw new FolderNotFound("Folder with the specified ID does not exist.");
        }
        else if (folder.getOwnerId() != ownerId) {
            throw new FolderDoesntBelongToUser("Folder does not belong to this user.");
        }
        return folder;
    }

    public Folder getRootFolder(long ownerId) {
        return folderRepository.findByParentFolderIsNullAndOwnerId(ownerId).get(0);
    }

    public void deleteRootFolder(long ownerId) {
        folderRepository.deleteByOwnerId(ownerId);
    }
}
