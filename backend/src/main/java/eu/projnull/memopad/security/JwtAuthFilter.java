package eu.projnull.memopad.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import eu.projnull.memopad.models.User;
import eu.projnull.memopad.services.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/*
 * Credits to https://www.geeksforgeeks.org/spring-boot-3-0-jwt-authentication-with-spring-security-using-mysql-database/
 * This is a modified version of the original code, which I wouldn't have had figured out by my self in a reasonable amount of time.
 * Might revisit this in the future, but for the time being, this will do.
 */
@Component
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    // The proper way to do this is to inject the JWTService and UserDetailsService.
    // Since our UserService and JWTService use a Long userId, instead of a
    // username, we can't use a UserDetailsService here, so this is a workaround
    // until I refactor at some point in the future.
    private final UserService userService;

    public JwtAuthFilter(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        User user = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            user = userService.fromJwtToken(token).orElse(null);
        }

        // check if the token is valid and set the user in the security context
        if (user != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                    user, null, user.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
        filterChain.doFilter(request, response);
    }
}
