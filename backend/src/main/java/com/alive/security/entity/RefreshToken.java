package com.alive.security.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_tokens")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Long tokenId;

    // JWT는 클레임(이메일 등) 길이에 따라 기본 varchar(255)를 쉽게 넘어선다
    @Column(nullable = false, unique = true, length = 1000)
    private String token;

    @Column(nullable = false)
    private String email;  // 사용자 이메일

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // 만료 여부 확인
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiresAt);
    }

    // 토큰값 및 만료일 업데이트
    public void updateToken(String token) {
        this.token = token;
        this.expiresAt = LocalDateTime.now().plusDays(7);
    }
}