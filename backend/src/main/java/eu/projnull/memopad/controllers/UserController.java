package eu.projnull.memopad.controllers;

import eu.projnull.memopad.services.FolderService;
import eu.projnull.memopad.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import eu.projnull.memopad.controllers.dto.LoginCredentials;
import eu.projnull.memopad.controllers.dto.TokenResponse;
import eu.projnull.memopad.controllers.dto.UserPublicResponse;
import eu.projnull.memopad.models.User;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final FolderService folderService;

    private final UserService userService;

    UserController(UserService userService, FolderService folderService) {
        this.userService = userService;
        this.folderService = folderService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authentication/sign in endpoint", security = {}, description = "Accepts user credentials and returns a response with a token string field if valid.")
    public TokenResponse login(@RequestBody LoginCredentials loginCredentials) {
        String token = userService.login(loginCredentials.getUsername(), loginCredentials.getPassword());
        return new TokenResponse(token);
    }

    @PostMapping("/register")
    @Operation(summary = "User sign up endpoint", security = {}, description = "Accepts desired user credentials and creates a new account with the given username if it isn't taken already. Returns a JWT token in a token string field is registration was successful")
    public TokenResponse register(@RequestBody LoginCredentials loginCredentials) throws IllegalArgumentException {
        userService.register(loginCredentials.getUsername(), loginCredentials.getUsername(),
                loginCredentials.getPassword());
        User user = (User) userService.loadUserByUsername(loginCredentials.getUsername());
        folderService.createFolder(user.getId(), loginCredentials.getUsername(), null);
        String token = userService.login(loginCredentials.getUsername(), loginCredentials.getPassword());
        return new TokenResponse(token);
    }

    @GetMapping("/info")
    @Operation(summary = "Returns information about the current user.")
    public UserPublicResponse info() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return new UserPublicResponse(user.getId(), user.getUsername(), user.getEmail());
    }
}
