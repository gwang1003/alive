package com.alive.domain.banner.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 배너 수정 요청 DTO (제목/링크/순서/활성상태)
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BannerUpdateRequest {

    private String title;
    private String linkUrl;
    private Integer displayOrder;
    private Boolean isActive;
}
