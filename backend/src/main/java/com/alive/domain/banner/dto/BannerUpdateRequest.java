package com.alive.domain.banner.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
