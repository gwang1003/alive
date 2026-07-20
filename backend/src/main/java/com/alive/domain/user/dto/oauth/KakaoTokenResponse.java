package com.alive.domain.user.dto.oauth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 카카오 토큰 엔드포인트 응답 DTO (access_token만 사용)
 */
@Getter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class KakaoTokenResponse {

    @JsonProperty("access_token")
    private String accessToken;
}
