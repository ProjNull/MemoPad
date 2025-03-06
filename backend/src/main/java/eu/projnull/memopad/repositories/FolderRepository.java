package eu.projnull.memopad.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.Repository;

import eu.projnull.memopad.models.Folder;

public interface FolderRepository extends Repository<Folder,Long> {
    Folder save(Folder folder);
    Optional<Folder> findById(long id);
    List<Folder> findByParentFolderIsNullAndOwnerId(long ownerId);
    List<Folder> findByParentFolder(Folder folder);
    void delete(Folder folder);
    void deleteByOwnerId(long ownerId);
}
