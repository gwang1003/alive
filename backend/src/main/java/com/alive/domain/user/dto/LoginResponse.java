package com.alive.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 로그인 응답 DTO. refreshToken 필드는 컨트롤러에서 쿠키로 옮기고 응답 본문에서는 제외한다.
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String accessToken;   // AccessToken만 Response Body에 포함
    private String refreshToken;  // 내부 처리용 (Controller에서 Cookie로 변환)
    private String email;
    private String name;
    private String role;
    private String message;
}