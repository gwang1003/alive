package com.alive.domain.user.controller;

import com.alive.domain.user.entity.User;
import com.alive.domain.user.service.OAuthService;
import com.alive.security.service.RefreshTokenService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.UUID;

/**
 * 카카오/네이버 소셜 로그인 (Authorization Code 방식).
 * "로그인" 버튼은 이 컨트롤러의 authorize 엔드포인트로 브라우저를 직접 이동시키고,
 * 각 제공자가 redirect-uri(=여기 callback 엔드포인트)로 code를 실어 돌려보내면
 * 토큰 교환 → 프로필 조회 → 회원 조회/생성 → 우리 서비스 JWT 발급까지 처리한다.
 */
@RestController
@RequestMapping("/api/auth/oauth")
@RequiredArgsConstructor
public class OAuthController {

    private static final String NAVER_STATE_COOKIE = "naverOAuthState";

    private final OAuthService oAuthService;
    private final RefreshTokenService refreshTokenService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration;

    /**
     * 카카오 인가 화면으로 리다이렉트
     */
    @GetMapping("/kakao/authorize")
    public void kakaoAuthorize(HttpServletResponse response) throws IOException {
        response.sendRedirect(oAuthService.buildKakaoAuthorizeUrl());
    }

    /**
     * 카카오 인가코드 콜백: 토큰 교환/프로필 조회 후 회원 조회·생성하고 로그인 처리
     */
    @GetMapping("/kakao/callback")
    public void kakaoCallback(@RequestParam String code, HttpServletResponse response) throws IOException {
        User user = oAuthService.handleKakaoCallback(code);
        issueTokensAndRedirect(user, response);
    }

    /**
     * 네이버 인가 화면으로 리다이렉트. CSRF 방지용 state 값을 생성해 쿠키에 저장한다.
     */
    @GetMapping("/naver/authorize")
    public void naverAuthorize(HttpServletResponse response) throws IOException {
        String state = UUID.randomUUID().toString();

        Cookie stateCookie = new Cookie(NAVER_STATE_COOKIE, state);
        stateCookie.setHttpOnly(true);
        stateCookie.setSecure(true);
        stateCookie.setPath("/");
        stateCookie.setMaxAge(300); // 5분이면 로그인 절차 마치기 충분
        stateCookie.setAttribute("SameSite", "Lax");
        response.addCookie(stateCookie);

        response.sendRedirect(oAuthService.buildNaverAuthorizeUrl(state));
    }

    /**
     * 네이버 인가코드 콜백: state 값 검증 후 토큰 교환/프로필 조회하여 로그인 처리
     */
    @GetMapping("/naver/callback")
    public void naverCallback(
            @RequestParam String code,
            @RequestParam String state,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        String expectedState = extractCookie(request, NAVER_STATE_COOKIE);
        if (expectedState == null || !expectedState.equals(state)) {
            throw new RuntimeException("잘못된 로그인 요청입니다 (state 불일치)");
        }

        User user = oAuthService.handleNaverCallback(code, state);
        issueTokensAndRedirect(user, response);
    }

    /**
     * RefreshToken을 발급해 HttpOnly 쿠키로 심고 프론트엔드 콜백 페이지로 리다이렉트
     */
    private void issueTokensAndRedirect(User user, HttpServletResponse response) throws IOException {
        // AccessToken은 body로 내려줄 수 없는(브라우저 리다이렉트) 흐름이라, 일반 로그인과 동일하게
        // RefreshToken만 HttpOnly 쿠키로 심어두고 프론트가 /oauth/callback에서 /auth/refresh를 호출해
        // AccessToken을 받아가게 한다.
        String refreshToken = refreshTokenService.createRefreshToken(user.getEmail());

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(true);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge((int) (refreshTokenExpiration / 1000));
        refreshTokenCookie.setAttribute("SameSite", "Lax");
        response.addCookie(refreshTokenCookie);

        response.sendRedirect(frontendUrl + "/oauth/callback");
    }

    /**
     * 요청 쿠키 목록에서 이름으로 값을 찾아 반환 (없으면 null)
     */
    private String extractCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        for (Cookie cookie : cookies) {
            if (name.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
