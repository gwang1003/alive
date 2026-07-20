package com.alive.domain.user.entity;

import jakarta.persistence.*;
        import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * 회원 엔티티. 이메일/비밀번호 가입과 카카오/네이버 소셜 로그인 가입을 모두 표현한다.
 */
@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;  // 암호화된 비밀번호 저장

    @Column(nullable = false, length = 50)
    private String name;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.USER;  // USER 또는 ADMIN

    // 소셜 로그인 제공자 (LOCAL: 이메일/비밀번호 가입). 소셜 로그인 사용자는 password에
    // 로그인에 사용되지 않는 임의값이 암호화되어 들어간다 (password 컬럼이 NOT NULL이라 비워둘 수 없음).
    @Column(nullable = false, length = 20, columnDefinition = "varchar(20) default 'LOCAL'")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AuthProvider provider = AuthProvider.LOCAL;

    // 소셜 로그인 제공자가 발급하는 사용자 고유 ID (LOCAL 가입 사용자는 null)
    @Column(name = "provider_id", length = 100)
    private String providerId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * 이름/전화번호 수정
     */
    public void updateProfile(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }

    /**
     * 암호화된 비밀번호로 교체
     */
    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }
}