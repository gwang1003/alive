package com.alive.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 아이디(이메일) 찾기 응답 DTO (마스킹된 이메일 반환)
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FindEmailResponse {
    private String maskedEmail;
}
