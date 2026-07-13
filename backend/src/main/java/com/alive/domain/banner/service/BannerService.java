package com.alive.domain.banner.service;

import com.alive.common.service.FileStorageService;
import com.alive.domain.banner.dto.BannerResponse;
import com.alive.domain.banner.dto.BannerUpdateRequest;
import com.alive.domain.banner.entity.Banner;
import com.alive.domain.banner.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BannerService {

    private final BannerRepository bannerRepository;
    private final FileStorageService fileStorageService;

    public List<BannerResponse> getActiveBanners() {
        return bannerRepository.findByIsActiveTrueOrderByDisplayOrderAsc().stream()
                .map(BannerResponse::fromEntity)
                .toList();
    }

    public List<BannerResponse> getAllBanners() {
        return bannerRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(BannerResponse::fromEntity)
                .toList();
    }

    @Transactional
    public BannerResponse createBanner(String title, String linkUrl, Integer displayOrder, MultipartFile image) {
        String imageUrl = fileStorageService.storeFile(image, "banners");

        Banner banner = Banner.builder()
                .title(title)
                .imageUrl(imageUrl)
                .linkUrl(linkUrl)
                .displayOrder(displayOrder != null ? displayOrder : 0)
                .isActive(true)
                .build();

        return BannerResponse.fromEntity(bannerRepository.save(banner));
    }

    @Transactional
    public BannerResponse updateBanner(Long bannerId, BannerUpdateRequest request) {
        Banner banner = bannerRepository.findById(bannerId)
                .orElseThrow(() -> new RuntimeException("배너를 찾을 수 없습니다"));
        banner.update(request.getTitle(), request.getLinkUrl(), request.getDisplayOrder(), request.getIsActive());
        return BannerResponse.fromEntity(banner);
    }

    @Transactional
    public void deleteBanner(Long bannerId) {
        Banner banner = bannerRepository.findById(bannerId)
                .orElseThrow(() -> new RuntimeException("배너를 찾을 수 없습니다"));
        fileStorageService.deleteFile(banner.getImageUrl());
        bannerRepository.delete(banner);
    }
}
