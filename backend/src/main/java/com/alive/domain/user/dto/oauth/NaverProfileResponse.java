package com.alive.domain.user.dto.oauth;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 네이버 사용자 프로필 조회 응답 DTO (id, 이메일, 이름)
 */
@Getter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class NaverProfileResponse {

    private Response response;

    @Getter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Response {
        private String id;
        private String email;
        private String name;
    }
}
