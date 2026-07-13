package com.alive.domain.banner.controller;

import com.alive.domain.banner.dto.BannerResponse;
import com.alive.domain.banner.dto.BannerUpdateRequest;
import com.alive.domain.banner.service.BannerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/banners")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminBannerController {

    private final BannerService bannerService;

    /**
     * 전체 배너 목록 조회 (비활성 포함)
     * GET /api/admin/banners
     */
    @GetMapping
    public ResponseEntity<List<BannerResponse>> getAllBanners() {
        return ResponseEntity.ok(bannerService.getAllBanners());
    }

    /**
     * 배너 등록 (멀티파트)
     * POST /api/admin/banners
     */
    @PostMapping
    public ResponseEntity<BannerResponse> createBanner(
            @RequestParam String title,
            @RequestParam(required = false) String linkUrl,
            @RequestParam(required = false) Integer displayOrder,
            @RequestPart MultipartFile image
    ) {
        BannerResponse response = bannerService.createBanner(title, linkUrl, displayOrder, image);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 배너 수정 (제목/링크/순서/활성상태)
     * PATCH /api/admin/banners/{bannerId}
     */
    @PatchMapping("/{bannerId}")
    public ResponseEntity<BannerResponse> updateBanner(
            @PathVariable Long bannerId,
            @Valid @RequestBody BannerUpdateRequest request
    ) {
        return ResponseEntity.ok(bannerService.updateBanner(bannerId, request));
    }

    /**
     * 배너 삭제
     * DELETE /api/admin/banners/{bannerId}
     */
    @DeleteMapping("/{bannerId}")
    public ResponseEntity<Void> deleteBanner(@PathVariable Long bannerId) {
        bannerService.deleteBanner(bannerId);
        return ResponseEntity.noContent().build();
    }
}
