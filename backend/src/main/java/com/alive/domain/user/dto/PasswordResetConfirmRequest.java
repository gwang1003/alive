package com.alive.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 비밀번호 재설정 확인 DTO (메일 링크의 토큰 + 새 비밀번호)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetConfirmRequest {

    @NotBlank(message = "토큰은 필수입니다")
    private String token;

    @NotBlank(message = "새 비밀번호는 필수입니다")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다")
    private String newPassword;
}
