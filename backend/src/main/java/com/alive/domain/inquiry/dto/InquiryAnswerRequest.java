package com.alive.domain.inquiry.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 문의 답변 등록 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InquiryAnswerRequest {

    @NotBlank(message = "답변 내용은 필수입니다")
    private String answer;
}
