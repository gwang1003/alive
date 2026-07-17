package com.alive.domain.user.service;

import com.alive.domain.user.dto.oauth.KakaoTokenResponse;
import com.alive.domain.user.dto.oauth.KakaoUserResponse;
import com.alive.domain.user.dto.oauth.NaverProfileResponse;
import com.alive.domain.user.dto.oauth.NaverTokenResponse;
import com.alive.domain.user.entity.AuthProvider;
import com.alive.domain.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.net.URLEncoder;

@Service
@RequiredArgsConstructor
public class OAuthService {

    private final UserService userService;

    @Value("${oauth.kakao.client-id:}")
    private String kakaoClientId;

    @Value("${oauth.kakao.redirect-uri}")
    private String kakaoRedirectUri;

    @Value("${oauth.naver.client-id:}")
    private String naverClientId;

    @Value("${oauth.naver.client-secret:}")
    private String naverClientSecret;

    @Value("${oauth.naver.redirect-uri}")
    private String naverRedirectUri;

    public String buildKakaoAuthorizeUrl() {
        requireConfigured(kakaoClientId, "카카오");
        return "https://kauth.kakao.com/oauth/authorize"
                + "?client_id=" + kakaoClientId
                + "&redirect_uri=" + encode(kakaoRedirectUri)
                + "&response_type=code";
    }

    public String buildNaverAuthorizeUrl(String state) {
        requireConfigured(naverClientId, "네이버");
        return "https://nid.naver.com/oauth2.0/authorize"
                + "?client_id=" + naverClientId
                + "&redirect_uri=" + encode(naverRedirectUri)
                + "&response_type=code"
                + "&state=" + encode(state);
    }

    public User handleKakaoCallback(String code) {
        RestClient restClient = RestClient.create();

        KakaoTokenResponse tokenResponse = restClient.post()
                .uri("https://kauth.kakao.com/oauth/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body("grant_type=authorization_code"
                        + "&client_id=" + kakaoClientId
                        + "&redirect_uri=" + encode(kakaoRedirectUri)
                        + "&code=" + code)
                .retrieve()
                .body(KakaoTokenResponse.class);

        KakaoUserResponse profile = restClient.get()
                .uri("https://kapi.kakao.com/v2/user/me")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenResponse.getAccessToken())
                .retrieve()
                .body(KakaoUserResponse.class);

        String email = profile.getKakaoAccount() != null ? profile.getKakaoAccount().getEmail() : null;
        String nickname = profile.getKakaoAccount() != null && profile.getKakaoAccount().getProfile() != null
                ? profile.getKakaoAccount().getProfile().getNickname()
                : null;

        return userService.findOrCreateOAuthUser(AuthProvider.KAKAO, String.valueOf(profile.getId()), email, nickname);
    }

    public User handleNaverCallback(String code, String state) {
        RestClient restClient = RestClient.create();

        NaverTokenResponse tokenResponse = restClient.get()
                .uri("https://nid.naver.com/oauth2.0/token"
                        + "?grant_type=authorization_code"
                        + "&client_id=" + naverClientId
                        + "&client_secret=" + naverClientSecret
                        + "&code=" + code
                        + "&state=" + encode(state))
                .retrieve()
                .body(NaverTokenResponse.class);

        NaverProfileResponse profile = restClient.get()
                .uri("https://openapi.naver.com/v1/nid/me")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + tokenResponse.getAccessToken())
                .retrieve()
                .body(NaverProfileResponse.class);

        NaverProfileResponse.Response info = profile.getResponse();
        return userService.findOrCreateOAuthUser(AuthProvider.NAVER, info.getId(), info.getEmail(), info.getName());
    }

    private void requireConfigured(String clientId, String providerName) {
        if (clientId == null || clientId.isBlank()) {
            throw new RuntimeException(providerName + " 로그인이 아직 설정되지 않았습니다. 관리자에게 문의해주세요.");
        }
    }

    private String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
