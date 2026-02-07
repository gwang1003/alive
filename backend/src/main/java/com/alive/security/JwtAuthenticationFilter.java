package com.alive.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. 요청 헤더에서 Authorization 추출
        String authorizationHeader = request.getHeader("Authorization");

        String token = null;
        String email = null;

        // 2. "Bearer " 로 시작하는지 확인하고 토큰 추출
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7); // "Bearer " 이후 문자열

            try {
                // 3. 토큰에서 이메일 추출
                email = jwtUtil.getEmailFromToken(token);
            } catch (Exception e) {
                logger.error("JWT 토큰에서 사용자 정보를 추출할 수 없습니다: " + e.getMessage());
            }
        }

        // 4. 이메일이 있고, 아직 인증되지 않은 경우
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 5. 토큰 유효성 검증
            if (jwtUtil.validateToken(token)) {

                // 6. 토큰에서 역할(Role) 추출
                String role = jwtUtil.getRoleFromToken(token);

                // 7. 권한 설정 (ROLE_USER, ROLE_ADMIN 형식으로)
                SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

                // 8. Authentication 객체 생성
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,                              // principal (사용자 이메일)
                                null,                               // credentials (비밀번호, 필요 없음)
                                Collections.singletonList(authority) // authorities (권한)
                        );

                // 9. 요청 정보 설정
                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // 10. SecurityContext에 인증 정보 저장
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // 11. 다음 필터로 진행
        filterChain.doFilter(request, response);
    }
}