package eu.projnull.memopad.services;

import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import eu.projnull.memopad.models.Folder;
import eu.projnull.memopad.repositories.FolderRepository;

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

    public void deleteFolder(long ownerId, Folder folder) {
        if (folder.getOwnerId() != ownerId) {
            throw new IllegalArgumentException("Folder does not belong to user");
        }
        folderRepository.delete(folder);
    }

    public Folder moveFolder(long ownerId, Folder folder, Folder newParentFolder) {
        if (folder.getOwnerId() != ownerId) {
            throw new IllegalArgumentException("Folder does not belong to user");
        }
        // TODO: Check whether newParentFolder is a child of this folder or child of this folder's children 
        folder.setParentFolder(newParentFolder);
        return folderRepository.save(folder);
    }

    public Folder renameFolder(long ownerId, Folder folder, String newName) {
        if (folder.getOwnerId() != ownerId) {
            throw new IllegalArgumentException("Folder does not belong to user");
        }
        folder.setName(newName);
        return folderRepository.save(folder);
    }

    public Folder getFolder(long ownerId, long folderId) {
        Folder folder = folderRepository.findById(folderId).orElse(null);
        if (folder == null || folder.getOwnerId() != ownerId) {
            throw new IllegalArgumentException("Folder does not exist or does not belong to user");
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
