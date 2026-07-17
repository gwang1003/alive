package com.alive.domain.restock.service;

import com.alive.domain.product.entity.ProductStock;
import com.alive.domain.product.repository.ProductStockRepository;
import com.alive.domain.restock.dto.RestockNotificationResponse;
import com.alive.domain.restock.entity.RestockNotification;
import com.alive.domain.restock.repository.RestockNotificationRepository;
import com.alive.domain.user.entity.User;
import com.alive.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RestockNotificationService {

    private final RestockNotificationRepository restockNotificationRepository;
    private final ProductStockRepository productStockRepository;
    private final UserRepository userRepository;

    @Transactional
    public RestockNotificationResponse requestNotification(String email, Long stockId) {
        User user = getUser(email);
        ProductStock stock = productStockRepository.findById(stockId)
                .orElseThrow(() -> new RuntimeException("옵션을 찾을 수 없습니다"));

        if (stock.getQuantity() > 0) {
            throw new RuntimeException("재고가 있는 상품은 재입고 알림을 신청할 수 없습니다");
        }
        if (restockNotificationRepository.existsByUserUserIdAndProductStockStockId(user.getUserId(), stockId)) {
            throw new RuntimeException("이미 재입고 알림을 신청한 상품입니다");
        }

        RestockNotification notification = RestockNotification.builder()
                .user(user)
                .productStock(stock)
                .build();

        return RestockNotificationResponse.fromEntity(restockNotificationRepository.save(notification));
    }

    @Transactional
    public void cancelNotification(String email, Long stockId) {
        User user = getUser(email);
        RestockNotification notification = restockNotificationRepository.findByUserUserIdAndProductStockStockId(user.getUserId(), stockId)
                .orElseThrow(() -> new RuntimeException("신청 내역을 찾을 수 없습니다"));
        restockNotificationRepository.delete(notification);
    }

    public boolean hasRequested(String email, Long stockId) {
        User user = getUser(email);
        return restockNotificationRepository.existsByUserUserIdAndProductStockStockId(user.getUserId(), stockId);
    }

    // 내 재입고 알림함 (신청 대기 중 + 재입고 완료 모두 최신순)
    public List<RestockNotificationResponse> getMyNotifications(String email) {
        User user = getUser(email);
        return restockNotificationRepository.findByUserUserIdOrderByCreatedAtDesc(user.getUserId()).stream()
                .map(RestockNotificationResponse::fromEntity)
                .toList();
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));
    }
}
