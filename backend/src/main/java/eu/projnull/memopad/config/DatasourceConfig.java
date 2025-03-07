package eu.projnull.memopad.config;

import javax.sql.DataSource;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DatasourceConfig {
    @Bean
    public DataSource getDataSource() {
        DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();
        String dbHost = System.getenv("PG_HOST");
        String dbPort = System.getenv("PG_PORT");
        String dbUser = System.getenv("PG_USER");
        String dbPassword = System.getenv("PG_PASSWORD");
        String dbName = System.getenv("PG_DATABASE");

        if (dbHost == null || dbPort == null || dbName == null || dbUser == null || dbPassword == null) {
            throw new NullPointerException(
                    "One of the environment variables DB_HOST, DB_PORT, DB_NAME, DB_USER or DB_PASSWORD is not set!");
        }

        dataSourceBuilder.driverClassName("org.postgresql.Driver");
        dataSourceBuilder.url("jdbc:postgresql://"
                + dbHost
                + ":"
                + dbPort
                + "/"
                + dbName);
        dataSourceBuilder.username(dbUser);
        dataSourceBuilder.password(dbPassword);
        return dataSourceBuilder.build();
    }
}
