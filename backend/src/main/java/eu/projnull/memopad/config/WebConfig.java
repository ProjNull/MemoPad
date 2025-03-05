package eu.projnull.memopad.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import io.micrometer.common.lang.Nullable;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(@Nullable ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**", "/{name:^(?!api).+}/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600);
    }
}
