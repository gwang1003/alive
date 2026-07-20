package com.alive.domain.inquiry.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 문의 등록 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InquiryCreateRequest {

    @NotBlank(message = "제목은 필수입니다")
    private String title;

    @NotBlank(message = "문의 내용은 필수입니다")
    private String content;
}
