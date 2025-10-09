package eu.projnull.memopad.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(title = "Memopad API", version = "1.2.0", description = "The Spring Boot backend for {NULL} MemoPad"),
        servers = {
                @Server(url = "https://memopad.script.projnull.eu", description = "Production (HTTPS)"),
                @Server(url = "http://localhost:4200", description = "Local dev for Angular proxy (HTTP)"),
                @Server(url = "http://localhost:8080", description = "Local dev for Spring Boot")
        },
        security = @SecurityRequirement(name = "bearerAuth") // Apply globally
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer", // the actual scheme
        bearerFormat = "JWT" // Shows JWT in the UI
)
public class OpenAPISecurityConfig {}
