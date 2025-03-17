package eu.projnull.memopad.services;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import eu.projnull.memopad.models.User;
import eu.projnull.memopad.repositories.UserRepository;

@Service
public class UserService implements UserDetailsService {

    private UserRepository userRepository;
    private JwtService jwtService;
    private PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Try to retrieve a user from a JWT token.
     *
     * If the token is invalid or does not contain a valid user ID, an empty
     * Optional is returned.
     *
     * @param token the JWT token to parse
     * @return a user if the token is valid and contains a valid user ID, or an
     *         empty Optional if the token is invalid
     */
    public Optional<User> fromJwtToken(String token) {
        if (token == null) {
            return Optional.empty();
        }
        Optional<Long> claimUserId = jwtService.getUserIdFromToken(token);
        if (claimUserId.isEmpty()) {
            return Optional.empty();
        }
        Long userId = claimUserId.get();
        if (userId == null) {
            return Optional.empty();
        }
        return userRepository.findById(userId);
    }

    /**
     * Registers a new user, given a username, email and a plain password.
     *
     * <p>
     * The plain password is hashed using the configured password encoder.
     *
     * @param username      the username to register
     * @param email         the email to register
     * @param plainPassword the plain password to hash and save
     * @throws IllegalArgumentException if the username is already in use
     */
    public void register(String username, String email, String plainPassword) throws IllegalArgumentException {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already in use");
        }
        String hashedPassword = passwordEncoder.encode(plainPassword);
        User user = User.builder().username(username).email(email).password(hashedPassword).build();
        userRepository.save(user);
    }

    /**
     * Authenticates a user using a username and plain password.
     * 
     * The username must exist in the database and the given password must match
     * the stored hashed password. If either of these conditions are not met, an
     * IllegalArgumentException is thrown.
     * 
     * If the authentication is successful, a JWT token is generated and
     * returned. The token is signed with a secret key and includes the user's ID
     * as the subject, specifies the backend as the audience, and sets the issued
     * time to the current instant. The token expires in one day from the issue
     * time.
     * 
     * @param username      the username of the user to authenticate
     * @param plainPassword the plain password of the user to authenticate
     * @return a JWT token as a string
     * @throws IllegalArgumentException if the username does not exist or the
     *                                  password is invalid
     */
    public String login(String username, String plainPassword)
            throws IllegalArgumentException, UsernameNotFoundException {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }
        User user = optionalUser.get();
        if (!passwordEncoder.matches(plainPassword, user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }
        return jwtService.generateNewToken(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }
        return optionalUser.get();
    }

}
