package com.alive.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {


    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // PasswordEncoder Bean 등록 (BCrypt 암호화)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Spring Security 설정
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF 비활성화 (JWT 사용 시 필요 없음)
                .csrf(csrf -> csrf.disable())

                // 세션 사용 안 함 (JWT는 Stateless)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 요청 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 인증 없이 접근 가능한 URL
                        .requestMatchers(
                                "/api/auth/**",          // 회원가입, 로그인
                                "/api/products/**",      // 상품 조회 (누구나 가능)
                                "/api/categories/**",    // 카테고리 조회
                                "/h2-console/**",        // H2 콘솔 (개발용)
                                "/swagger-ui/**",        // Swagger UI
                                "/v3/api-docs/**"        // API 문서
                        ).permitAll()

                        // 관리자만 접근 가능
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/users/admin-only").hasRole("ADMIN")  // 추가

                        // 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )
                // ⭐ JWT 필터 추가 (UsernamePasswordAuthenticationFilter 이전에 실행)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}