package com.alive.domain.banner.controller;

import com.alive.domain.banner.dto.BannerResponse;
import com.alive.domain.banner.service.BannerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 사용자용 배너 조회 API 컨트롤러
 */
@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerController {

    private final BannerService bannerService;

    /**
     * 활성 배너 목록 조회 (공개)
     * GET /api/banners
     */
    @GetMapping
    public ResponseEntity<List<BannerResponse>> getActiveBanners() {
        return ResponseEntity.ok(bannerService.getActiveBanners());
    }
}
