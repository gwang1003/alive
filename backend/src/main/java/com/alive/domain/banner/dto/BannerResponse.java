package com.alive.domain.banner.dto;

import com.alive.domain.banner.entity.Banner;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 배너 조회 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BannerResponse {

    private Long bannerId;
    private String title;
    private String imageUrl;
    private String linkUrl;
    private Integer displayOrder;
    private Boolean isActive;

    /**
     * Banner 엔티티를 응답 DTO로 변환
     */
    public static BannerResponse fromEntity(Banner banner) {
        return BannerResponse.builder()
                .bannerId(banner.getBannerId())
                .title(banner.getTitle())
                .imageUrl(banner.getImageUrl())
                .linkUrl(banner.getLinkUrl())
                .displayOrder(banner.getDisplayOrder())
                .isActive(banner.getIsActive())
                .build();
    }
}
