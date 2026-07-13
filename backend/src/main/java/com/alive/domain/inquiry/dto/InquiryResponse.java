package com.alive.domain.inquiry.dto;

import com.alive.domain.inquiry.entity.Inquiry;
import com.alive.domain.inquiry.entity.InquiryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InquiryResponse {

    private Long inquiryId;
    private String title;
    private String content;
    private String answer;
    private InquiryStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime answeredAt;
    private String userName;

    public static InquiryResponse fromEntity(Inquiry inquiry) {
        return InquiryResponse.builder()
                .inquiryId(inquiry.getInquiryId())
                .title(inquiry.getTitle())
                .content(inquiry.getContent())
                .answer(inquiry.getAnswer())
                .status(inquiry.getStatus())
                .createdAt(inquiry.getCreatedAt())
                .answeredAt(inquiry.getAnsweredAt())
                .userName(inquiry.getUser().getName())
                .build();
    }
}
