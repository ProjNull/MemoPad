package eu.projnull.memopad.controllers;

import eu.projnull.memopad.services.FolderService;
import eu.projnull.memopad.services.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully signed in."), 
        @ApiResponse(responseCode = "401", description = "Bad credentials.")
    })
    public TokenResponse login(@RequestBody LoginCredentials loginCredentials) {
        try {
            String token = userService.login(loginCredentials.getUsername(), loginCredentials.getPassword());
            return new TokenResponse(token);
        } catch (UsernameNotFoundException | IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password.");
        }
    }

    @PostMapping("/register")
    @Operation(summary = "User sign up endpoint", security = {}, description = "Accepts desired user credentials and creates a new account with the given username if it isn't taken already. Returns a JWT token in a token string field is registration was successful")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Successfully signed up."), 
        @ApiResponse(responseCode = "409", description = "Username already in use.")
    })
    public TokenResponse register(@RequestBody LoginCredentials loginCredentials) throws IllegalArgumentException {
        try {
            userService.loadUserByUsername(loginCredentials.getUsername());
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already in use.");
        } catch (UsernameNotFoundException ignored) {
            // Username is available
        }
        userService.register(loginCredentials.getUsername(), loginCredentials.getUsername(),
                loginCredentials.getPassword());
        User user = (User) userService.loadUserByUsername(loginCredentials.getUsername());
        folderService.createFolder(user.getId(), loginCredentials.getUsername(), null);
        String token = userService.login(loginCredentials.getUsername(), loginCredentials.getPassword());
        return new TokenResponse(token);
    }

    @GetMapping("/info")
    @Operation(summary = "Returns information about the current user.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Session token valid."), 
        @ApiResponse(responseCode = "403", description = "No valid session token provided. (filtered before reaching this endpoint)")
    })
    public UserPublicResponse info() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return new UserPublicResponse(user.getId(), user.getUsername(), user.getEmail());
    }
}
