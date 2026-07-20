package com.alive.domain.banner.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 배너 엔티티
 */
@Entity
@Table(name = "banners")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "banner_id")
    private Long bannerId;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "link_url", length = 500)
    private String linkUrl;

    @Column(name = "display_order")
    @Builder.Default
    private Integer displayOrder = 0;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /**
     * 배너 정보 수정 (null인 필드는 변경하지 않음)
     */
    public void update(String title, String linkUrl, Integer displayOrder, Boolean isActive) {
        if (title != null) this.title = title;
        if (linkUrl != null) this.linkUrl = linkUrl;
        if (displayOrder != null) this.displayOrder = displayOrder;
        if (isActive != null) this.isActive = isActive;
    }
}
