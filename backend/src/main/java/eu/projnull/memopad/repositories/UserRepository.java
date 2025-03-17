package eu.projnull.memopad.repositories;

import java.util.Optional;

import org.springframework.data.repository.Repository;

import eu.projnull.memopad.models.User;

public interface UserRepository extends Repository<User, Long> {
    Optional<User> findById(Long id);

    Optional<User> findByUsername(String username);

    User save(User user);

    void delete(User user);
}
