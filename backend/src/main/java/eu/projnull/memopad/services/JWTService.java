package eu.projnull.memopad.services;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;
import eu.projnull.memopad.models.User;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class JWTService {
    private static final Long SECONDS_ONE_DAY = 60L * 60L * 24L;
    private String jwtSecret;

    public JWTService() {
        this.jwtSecret = System.getenv("JWT_SECRET");
        if (this.jwtSecret == null) {
            // Generate a random secret
            SecureRandom secureRandom = new SecureRandom();
            this.jwtSecret = new String(secureRandom.generateSeed(32));
            StringBuilder sb = new StringBuilder();
            for (byte b : this.jwtSecret.getBytes()) {
                sb.append(String.format("%02x", b).toUpperCase());
            }
            log.warn("No JWT_SECRET environment variable set. Using a random secret: {}", sb.toString());
        }
    }

    /**
     * Retrieves the secret key used for signing JWT tokens.
     *
     * The secret key is derived from the JWT secret string using HMAC SHA
     * algorithm.
     * By default, this is either the secret provided in the JWT_SECRET environment
     * variable or a secure random string of (usually un-printable) bytes.
     *
     * @return the SecretKey used for JWT signing
     */
    private SecretKey getJwtSecretKey() {
        return Keys.hmacShaKeyFor(this.jwtSecret.getBytes());
    }

    /**
     * Generates a new JWT token for the specified user.
     *
     * The token includes the user's ID as the subject, specifies the backend
     * as the audience, and sets the issued time to the current instant. The
     * token expires in one day from the issue time.
     *
     * @param user the user for whom to generate the token
     * @return a JWT token as a string
     */
    public String generateNewToken(User user) {
        return Jwts.builder().subject(String.valueOf(user.getId())).audience().add("backend").and()
                .issuedAt(Date.from(Instant.now())).expiration(Date.from(Instant.now().plusSeconds(SECONDS_ONE_DAY)))
                .signWith(getJwtSecretKey()).compact();
    }

    /**
     * Validate a JWT token by checking if it is issued by the backend and if
     * the subject matches the given user.
     *
     * @param token the token to validate
     * @param user  the user to validate for
     * @return true if the token is valid, false otherwise
     */
    public boolean validateToken(String token, User user) {
        try {
            Jwts.parser().verifyWith(getJwtSecretKey()).requireAudience("backend")
                    .requireSubject(String.valueOf(user.getId())).build().parse(token).toString();
        } catch (JwtException e) {
            return false;
        }
        return true;
    }
}
