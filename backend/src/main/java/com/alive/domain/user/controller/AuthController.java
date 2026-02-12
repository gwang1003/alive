package com.alive.domain.user.controller;

import com.alive.domain.user.dto.*;
import com.alive.domain.user.entity.User;
import com.alive.domain.user.repository.UserRepository;
import com.alive.domain.user.service.UserService;
import com.alive.security.JwtUtil;
import com.alive.security.service.RefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final RefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Value("${jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration;

    /**
     * 회원가입
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 로그인
     * POST /api/auth/login
     * RefreshToken은 HttpOnly Cookie로, AccessToken은 Response Body로 반환
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        LoginResponse loginResponse = userService.login(request);

        // RefreshToken을 HttpOnly Cookie에 저장
        Cookie refreshTokenCookie = createRefreshTokenCookie(loginResponse.getRefreshToken());
        response.addCookie(refreshTokenCookie);

        // Response Body에는 AccessToken만 포함 (RefreshToken 제거)
        LoginResponse responseBody = LoginResponse.builder()
                .accessToken(loginResponse.getAccessToken())
                .email(loginResponse.getEmail())
                .name(loginResponse.getName())
                .role(loginResponse.getRole())
                .message(loginResponse.getMessage())
                .build();

        return ResponseEntity.ok(responseBody);
    }

    /**
     * 토큰 갱신 (Cookie에서 RefreshToken 읽어서 새 AccessToken 발급)
     * POST /api/auth/refresh
     */
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refreshAccessToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        // Cookie에서 RefreshToken 추출
        String refreshToken = extractRefreshTokenFromCookie(request);

        if (refreshToken == null) {
            throw new RuntimeException("RefreshToken이 없습니다");
        }

        // RefreshToken 검증
        if (!refreshTokenService.validateRefreshToken(refreshToken)) {
            // 만료된 RefreshToken이면 Cookie 삭제
            deleteRefreshTokenCookie(response);
            throw new RuntimeException("유효하지 않거나 만료된 RefreshToken입니다");
        }

        // RefreshToken에서 이메일 추출
        String email = refreshTokenService.getEmailFromRefreshToken(refreshToken);

        // 사용자 조회
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        // 새 AccessToken 발급
        String newAccessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name());

        // 새 RefreshToken 발급 (선택: Refresh Token Rotation 적용 시)
        String newRefreshToken = refreshTokenService.createRefreshToken(user.getEmail());
        Cookie newRefreshTokenCookie = createRefreshTokenCookie(newRefreshToken);
        response.addCookie(newRefreshTokenCookie);

        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("accessToken", newAccessToken);
        responseBody.put("message", "AccessToken이 갱신되었습니다");

        return ResponseEntity.ok(responseBody);
    }

    /**
     * 로그아웃 (RefreshToken 삭제 + Cookie 삭제)
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        // Cookie에서 RefreshToken 추출
        String refreshToken = extractRefreshTokenFromCookie(request);

        if (refreshToken != null) {
            // RefreshToken에서 이메일 추출
            try {
                String email = refreshTokenService.getEmailFromRefreshToken(refreshToken);
                // DB에서 RefreshToken 삭제
                refreshTokenService.deleteRefreshToken(email);
            } catch (Exception e) {
                // 토큰이 유효하지 않아도 로그아웃 진행
            }
        }

        // Cookie 삭제
        deleteRefreshTokenCookie(response);

        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("message", "로그아웃되었습니다");

        return ResponseEntity.ok(responseBody);
    }

    /**
     * 이메일 중복 체크
     * GET /api/auth/check-email?email=test@example.com
     */
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailDuplicate(@RequestParam String email) {
        boolean available = !userService.isEmailExists(email);
        return ResponseEntity.ok(available);
    }

    // ========== Cookie 헬퍼 메서드 ==========

    /**
     * RefreshToken Cookie 생성
     */
    private Cookie createRefreshTokenCookie(String refreshToken) {
        Cookie cookie = new Cookie("refreshToken", refreshToken);
        cookie.setHttpOnly(true);  // JavaScript 접근 불가 (XSS 방지)
        cookie.setSecure(true);   // 개발: false, 운영: true (HTTPS에서만 전송)
        cookie.setPath("/");       // 모든 경로에서 접근 가능
        cookie.setMaxAge((int) (refreshTokenExpiration / 1000)); // 초 단위 (7일)
        // cookie.setDomain("yourdomain.com"); // 도메인 설정 (필요 시)
        cookie.setAttribute("SameSite", "Lax"); // CSRF 방지

        return cookie;
    }

    /**
     * Cookie에서 RefreshToken 추출
     */
    private String extractRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }

    /**
     * RefreshToken Cookie 삭제
     */
    private void deleteRefreshTokenCookie(HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // 즉시 만료

        response.addCookie(cookie);
    }
}