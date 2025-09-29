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
    @Operation(summary = "Authentication/sign in endpoint", security = {})
    public TokenResponse login(@RequestBody LoginCredentials loginCredentials) {
        String token = userService.login(loginCredentials.getUsername(), loginCredentials.getPassword());
        return new TokenResponse(token);
    }

    @PostMapping("/register")
    @Operation(summary = "User sign up endpoint", security = {})
    public TokenResponse register(@RequestBody LoginCredentials loginCredentials) throws IllegalArgumentException {
        userService.register(loginCredentials.getUsername(), loginCredentials.getUsername(),
                loginCredentials.getPassword());
        User user = (User) userService.loadUserByUsername(loginCredentials.getUsername());
        folderService.createFolder(user.getId(), loginCredentials.getUsername(), null);
        String token = userService.login(loginCredentials.getUsername(), loginCredentials.getPassword());
        return new TokenResponse(token);
    }

    @GetMapping("/info")
    public UserPublicResponse info() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return new UserPublicResponse(user.getId(), user.getUsername(), user.getEmail());
    }
}
