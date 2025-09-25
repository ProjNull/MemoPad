package eu.projnull.memopad.config;

import org.springframework.boot.autoconfigure.flyway.FlywayConfigurationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class FlywayConfig {

    @Bean
    public FlywayConfigurationCustomizer flywayConfigurationCustomizer(DataSource dataSource) {
        return configuration -> {
            try {
                String driverName = dataSource.getConnection().getMetaData().getDriverName().toLowerCase();
                String location;

                if (driverName.contains("sqlite")) {
                    location = "classpath:db/migrations/sqlite";
                } else if (driverName.contains("postgres")) {
                    location = "classpath:db/migrations/postgres";
                } else {
                    // fallback to postgres
                    location = "classpath:db/migrations/postgres";
                }

                configuration.locations(location);
            } catch (Exception e) {
                throw new RuntimeException("Could not determine DB driver for Flyway migrations", e);
            }
        };
    }
}
