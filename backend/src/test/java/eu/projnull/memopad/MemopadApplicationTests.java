package eu.projnull.memopad;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import eu.projnull.memopad.models.User;
import eu.projnull.memopad.services.JWTService;

// @SpringBootTest
// I can't get the datasource bean to not create in a test environment, so I'm just running this as a normal JUnit test suite.
class MemopadApplicationTests {
    @Test
    void generateNewToken() {
        JWTService jwtService = new JWTService();
        String token = jwtService.generateNewToken(
                User.builder().username("admin").password("admin").id(1L).email("example@example.com").build());
        assertNotNull(token);
    }

    @Test
    void validateToken() {
        JWTService jwtService = new JWTService();
        User user = User.builder().username("admin").password("admin").id(1L).email("example@example.com").build();
        String token = jwtService.generateNewToken(user);
        boolean isValid = jwtService.validateToken(token, user);
        assertTrue(isValid);
    }

    @Test
    void validateTokenInvalid() {
        JWTService jwtService = new JWTService();
        User user = User.builder().username("admin").password("admin").id(1L).email("example@example.com").build();
        String token = "clearly.not.valid";
        boolean isValid = jwtService.validateToken(token, user);
        assertFalse(isValid);
    }

    @Test
    void validateTokenBadUser() {
        JWTService jwtService = new JWTService();
        User user = User.builder().username("admin").password("admin").id(1L).email("example@example.com").build();
        String token = jwtService.generateNewToken(user);
        User badUser = User.builder().username("baduser").password("baduser").id(2L).email("example@example.com").build();
        boolean isValid = jwtService.validateToken(token, badUser);
        assertFalse(isValid);
    }
}
