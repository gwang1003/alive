package com.alive.domain.user.dto.oauth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 카카오 사용자 정보 조회 응답 DTO (id, 이메일, 닉네임)
 */
@Getter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class KakaoUserResponse {

    private Long id;

    @JsonProperty("kakao_account")
    private KakaoAccount kakaoAccount;

    @Getter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class KakaoAccount {
        private String email;
        private Profile profile;
    }

    @Getter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Profile {
        private String nickname;
    }
}
