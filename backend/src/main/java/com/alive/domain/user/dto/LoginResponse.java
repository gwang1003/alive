package com.alive.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;           // JWT 토큰
    private String email;           // 사용자 이메일
    private String name;            // 사용자 이름
    private String role;            // 사용자 역할 (USER/ADMIN)
    private String message;         // 응답 메시지
}