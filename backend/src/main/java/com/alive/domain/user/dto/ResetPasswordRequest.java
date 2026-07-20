package com.alive.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 비밀번호 찾기(재설정) 요청 DTO (이메일 + 이름 + 전화번호로 본인확인 후 새 비밀번호 설정)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {

    @NotBlank(message = "이메일은 필수입니다")
    private String email;

    @NotBlank(message = "이름은 필수입니다")
    private String name;

    @NotBlank(message = "전화번호는 필수입니다")
    private String phone;

    @NotBlank(message = "새 비밀번호는 필수입니다")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다")
    private String newPassword;
}
