package com.alive.domain.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 아이디(이메일) 찾기 요청 DTO (이름 + 전화번호로 본인확인)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FindEmailRequest {

    @NotBlank(message = "이름은 필수입니다")
    private String name;

    @NotBlank(message = "전화번호는 필수입니다")
    private String phone;
}
