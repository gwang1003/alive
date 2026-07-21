package com.alive.domain.product.service;

import com.alive.common.notification.NotificationSender;
import com.alive.common.service.FileStorageService;
import com.alive.domain.product.dto.*;
import com.alive.domain.product.entity.*;
import com.alive.domain.product.repository.*;
import com.alive.domain.restock.entity.RestockNotification;
import com.alive.domain.restock.repository.RestockNotificationRepository;
import java.io.File;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 상품 조회/등록/수정/삭제 및 재고 관리 비즈니스 로직을 처리하는 서비스
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    @Value("${file.upload-dir}")
    private String fileDir;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageRepository productImageRepository;
    private final ModelInfoRepository modelInfoRepository;
    private final ProductStockRepository productStockRepository;
    private final ProductDetailRepository productDetailRepository;
    private final FileStorageService fileStorageService;
    private final RestockNotificationRepository restockNotificationRepository;
    private final NotificationSender notificationSender;


    // ========== 상품 조회 (일반 사용자) ==========

    /**
     * 상품 목록 조회 (페이징)
     */
    public Page<ProductListResponse> getProductList(Pageable pageable) {
        Page<Product> products = productRepository.findByIsActiveTrue(pageable);
        return products.map(ProductListResponse::fromEntity);
    }

    /**
     * 상품 상세 조회
     */
    @Transactional
    public ProductDetailResponse getProductDetail(Long productId) {
        Product product = productRepository.findByProductIdAndIsActiveTrue(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다"));

        // 조회수 증가
        product.increaseViewCount();

        return ProductDetailResponse.fromEntity(product);
    }

    /**
     * 카테고리별 상품 조회
     */
    public Page<ProductListResponse> getProductsByCategory(Long categoryId, Pageable pageable) {
        Page<Product> products = productRepository.findByCategoryCategoryIdAndIsActiveTrue(
                categoryId,
                pageable
        );
        return products.map(ProductListResponse::fromEntity);
    }

    /**
     * 복합 필터링 조회
     */
    public Page<ProductListResponse> getProductsByFilters(
            Long categoryId,
            Gender gender,
            Integer minAge,
            Integer maxAge,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        Page<Product> products = productRepository.findByFilters(
                categoryId,
                gender,
                minAge,
                maxAge,
                minPrice,
                maxPrice,
                pageable
        );
        return products.map(ProductListResponse::fromEntity);
    }

    /**
     * 키워드 검색
     */
    public Page<ProductListResponse> searchProducts(String keyword, Pageable pageable) {
        Page<Product> products = productRepository.findByKeyword(keyword, pageable);
        return products.map(ProductListResponse::fromEntity);
    }

    /**
     * 인기 상품 조회 (조회수 기준)
     */
    public List<ProductListResponse> getPopularProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products = productRepository.findPopularProducts(pageable);
        return products.stream()
                .map(ProductListResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 신상품 조회
     */
    public List<ProductListResponse> getNewProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Product> products = productRepository.findNewProducts(pageable);
        return products.stream()
                .map(ProductListResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 할인 상품 조회
     */
    public Page<ProductListResponse> getDiscountedProducts(Pageable pageable) {
        Page<Product> products = productRepository.findDiscountedProducts(pageable);
        return products.map(ProductListResponse::fromEntity);
    }

    // ========== 상품 관리 (관리자) ==========


    /**
     * 상품 등록 (멀티파트 + JSON)
     */
    @Transactional
    public ProductResponse createProduct(
            ProductCreateRequest request,
            MultipartFile mainImage,
            List<MultipartFile> thumbnails,
            List<MultipartFile> detailFiles
    ) {
        // 1. 카테고리 확인
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다"));

        // 2. 상품 엔티티 생성
        Product product = Product.builder()
                .category(category)
                .name(request.getName())
                .description(request.getMainDescription())
                .price(request.getPrice())
                .gender(request.getGender())
                .stockQuantity(0) // 초기값, 재고 합산 후 업데이트
                .isActive(true)
                .build();

        Product savedProduct = productRepository.save(product);

        // 3. 메인 이미지 저장
        if (mainImage != null && !mainImage.isEmpty()) {
            String mainImageUrl = fileStorageService.storeFile(mainImage, "products");

            ProductImage mainImg = ProductImage.builder()
                    .product(savedProduct)
                    .imageUrl(mainImageUrl)
                    .isThumbnail(true)
                    .displayOrder(0)
                    .build();

            productImageRepository.save(mainImg);
        }

        // 4. 썸네일 이미지 저장
        if (thumbnails != null && !thumbnails.isEmpty()) {
            for (int i = 0; i < thumbnails.size(); i++) {
                MultipartFile thumbnail = thumbnails.get(i);
                String thumbnailUrl = fileStorageService.storeFile(thumbnail, "products/thumbnails");

                ProductImage thumbImg = ProductImage.builder()
                        .product(savedProduct)
                        .imageUrl(thumbnailUrl)
                        .isThumbnail(false)
                        .displayOrder(i + 1)
                        .build();

                productImageRepository.save(thumbImg);
            }
        }

        // 5. 모델 정보 저장
        ModelInfo modelInfo = ModelInfo.builder()
                .product(savedProduct)
                .modelName(request.getModelInfo().getModelName())
                .height(request.getModelInfo().getHeight())
                .weight(request.getModelInfo().getWeight())
                .wearingColor(request.getModelInfo().getWearingColor())
                .wearingSize(request.getModelInfo().getWearingSize())
                .build();

        modelInfoRepository.save(modelInfo);

        // 6. 재고 정보 저장 (색상 + 사이즈 조합)
        int totalStock = 0;
        for (ProductCreateRequest.StockItemDto stockDto : request.getStocks()) {
            ProductStock stock = ProductStock.builder()
                    .product(savedProduct)
                    .color(stockDto.getColor())
                    .size(stockDto.getSize())
                    .quantity(stockDto.getQuantity())
                    .build();

            productStockRepository.save(stock);
            totalStock += stockDto.getQuantity();
        }

        // 전체 재고 업데이트
        savedProduct.updateStockQuantity(totalStock);

        // 7. 상세 블록 저장 (TEXT + IMAGE)
        int imageFileIndex = 0;
        for (ProductCreateRequest.DetailBlockDto blockDto : request.getDetailBlocks()) {
            String content;

            if ("IMAGE".equals(blockDto.getType())) {
                // IMAGE 블록이면 detailFiles에서 순서대로 가져와서 저장
                if (detailFiles != null && imageFileIndex < detailFiles.size()) {
                    MultipartFile detailFile = detailFiles.get(imageFileIndex);
                    content = fileStorageService.storeFile(detailFile, "products/details");
                    imageFileIndex++;
                } else {
                    throw new RuntimeException("상세 이미지 파일이 부족합니다");
                }
            } else {
                // TEXT 블록이면 value 그대로 저장
                content = blockDto.getValue();
            }

            ProductDetail detail = ProductDetail.builder()
                    .product(savedProduct)
                    .type(blockDto.getType())
                    .content(content)
                    .displayOrder(blockDto.getDisplayOrder())
                    .build();

            productDetailRepository.save(detail);
        }

        return ProductResponse.builder()
                .productId(savedProduct.getProductId())
                .name(savedProduct.getName())
                .price(savedProduct.getPrice())
                .discountRate(savedProduct.getDiscountRate())
                .finalPrice(savedProduct.getFinalPrice())
                .message("상품이 등록되었습니다")
                .build();
    }



    /**
     * 전체 상품 목록 조회 (비활성 상품 포함, 관리자용)
     */
    public Page<ProductListResponse> getAdminProductList(Pageable pageable) {
        return productRepository.findAll(pageable).map(ProductListResponse::fromEntity);
    }

    /**
     * 상품 상세 조회 (비활성 상품 포함, 관리자용 수정 폼 로딩)
     */
    public ProductDetailResponse getAdminProductDetail(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다"));
        return ProductDetailResponse.fromEntity(product);
    }

    /**
     * 옵션(색상/사이즈)별 재고 수량 수정. 0 → 양수로 바뀌면 재입고 알림 신청자에게
     * 인앱 알림 플래그(notified)를 세우고 이메일도 실제로 발송한다.
     */
    @Transactional
    public ProductStockResponse updateStock(Long productId, Long stockId, StockUpdateRequest request) {
        ProductStock stock = productStockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("옵션을 찾을 수 없습니다"));

        if (!stock.getProduct().getProductId().equals(productId)) {
            throw new RuntimeException("해당 상품의 옵션이 아닙니다");
        }

        boolean wasOutOfStock = stock.getQuantity() == 0;
        stock.updateQuantity(request.getStockQuantity());

        if (wasOutOfStock && request.getStockQuantity() > 0) {
            List<RestockNotification> pending = restockNotificationRepository.findByProductStockStockIdAndNotifiedFalse(stockId);
            pending.forEach(notification -> {
                notification.markNotified();
                sendRestockEmail(notification, stock);
            });
        }

        return ProductStockResponse.fromEntity(stock);
    }

    // 재입고 알림 이메일 발송 (실제 전송은 EmailNotificationSender가 @Async로 처리)
    private void sendRestockEmail(RestockNotification notification, ProductStock stock) {
        String productName = stock.getProduct().getName();
        String subject = "[alive] 재입고 알림: " + productName;
        String content = String.format(
                "%s님, 신청하신 상품이 재입고되었습니다.%n%n" +
                "상품: %s%n" +
                "옵션: %s / %s%n%n" +
                "지금 확인하기: %s/product/detail/%d%n%n" +
                "감사합니다.%n- alive",
                notification.getUser().getName(),
                productName,
                stock.getColor(),
                stock.getSize(),
                frontendUrl,
                stock.getProduct().getProductId()
        );
        notificationSender.send(notification.getUser().getEmail(), subject, content);
    }

    /**
     * 상품 수정
     */
    @Transactional
    public ProductResponse updateProduct(Long productId, ProductUpdateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다"));

        // 카테고리 변경 시
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다"));
            product.updateCategory(category);
        }

        // 상품 정보 업데이트
        product.updateProduct(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getDiscountRate(),
                request.getIsActive()
        );

        return ProductResponse.builder()
                .productId(product.getProductId())
                .name(product.getName())
                .price(product.getPrice())
                .discountRate(product.getDiscountRate())
                .finalPrice(product.getFinalPrice())
                .message("상품이 수정되었습니다")
                .build();
    }

    /**
     * 상품 삭제 (soft delete - isActive = false)
     */
    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다"));

        // isActive를 false로 설정
        product.updateProduct(null, null, null, null, false);
    }

    /**
     * 특정 상품의 이미지 목록 조회
     */
    public List<ProductImageResponse> getProductImages(Long productId) {
        List<ProductImage> images = productImageRepository
                .findByProductProductIdOrderByDisplayOrderAsc(productId);
        return images.stream()
                .map(ProductImageResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 상품 이미지의 파일 시스템 경로 조합
     */
    public String getImageUrl(String imageUrl) {
        String fileUrl = fileDir + File.separator + "products" + File.separator + imageUrl;
        return fileUrl;
    }

    /**
     * 상품 썸네일 이미지의 파일 시스템 경로 조합
     */
    public String getThumbnailsImageUrl(String imageUrl) {
        String fileUrl = fileDir + File.separator + "products" + File.separator + "thumbnails" + File.separator + imageUrl;
        return fileUrl;
    }
}