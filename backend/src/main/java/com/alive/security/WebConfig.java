package com.alive.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

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
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // FileStorageService가 "/products", "/products/thumbnails", "/products/details" 하위로 저장하므로
        // 이 하나의 매핑으로 전부 커버됨. 실제 저장 위치는 application.yml의 file.upload-dir 설정을 그대로 따름.
        registry.addResourceHandler("/api/products/**")
                .addResourceLocations("file:///" + uploadDir + "/products/");
        registry.addResourceHandler("/api/banners/**")
                .addResourceLocations("file:///" + uploadDir + "/banners/");
        registry.addResourceHandler("/api/reviews/**")
                .addResourceLocations("file:///" + uploadDir + "/reviews/");
    }
}