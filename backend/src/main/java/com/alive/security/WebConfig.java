package com.alive.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "http://localhost:5173") // React 개발 서버
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true) // ⭐ Cookie 전송 허용 (중요!)
                .maxAge(3600);
    }

    @Override
    public void addResourceHandlers (ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/api/products/**").addResourceLocations("file:///D:/alive/uploads/products/");
        registry.addResourceHandler("/api/products/thumbnails/**").addResourceLocations("file:///D:/alive/uploads/products/thumbnails/");
    }
}