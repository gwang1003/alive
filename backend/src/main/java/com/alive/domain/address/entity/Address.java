package com.alive.domain.address.entity;

import com.alive.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 회원 배송지 엔티티
 */
@Entity
@Table(name = "addresses")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Long addressId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "recipient_name", nullable = false, length = 50)
    private String recipientName;

    @Column(nullable = false, length = 20)
    private String phone;

    @Column(nullable = false, length = 10)
    private String zipcode;

    @Column(nullable = false, length = 200)
    private String address;

    @Column(name = "address_detail", length = 200)
    private String addressDetail;

    @Column(name = "is_default")
    @Builder.Default
    private Boolean isDefault = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /**
     * 배송지 정보(받는 분, 연락처, 주소 등)를 갱신한다.
     */
    public void update(String recipientName, String phone, String zipcode, String address, String addressDetail) {
        this.recipientName = recipientName;
        this.phone = phone;
        this.zipcode = zipcode;
        this.address = address;
        this.addressDetail = addressDetail;
    }

    /**
     * 기본 배송지로 표시한다.
     */
    public void markDefault() {
        this.isDefault = true;
    }

    /**
     * 기본 배송지 표시를 해제한다.
     */
    public void unmarkDefault() {
        this.isDefault = false;
    }
}
