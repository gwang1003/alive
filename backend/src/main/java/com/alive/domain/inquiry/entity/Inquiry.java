package com.alive.domain.inquiry.entity;

import com.alive.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 1:1 문의 엔티티
 */
@Entity
@Table(name = "inquiries")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inquiry_id")
    private Long inquiryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String answer;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private InquiryStatus status = InquiryStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "answered_at")
    private LocalDateTime answeredAt;

    /**
     * 답변 등록 및 상태를 답변완료로 변경
     */
    public void answer(String answer) {
        this.answer = answer;
        this.status = InquiryStatus.ANSWERED;
        this.answeredAt = LocalDateTime.now();
    }
}
