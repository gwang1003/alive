package com.alive.domain.payment.service;

import com.alive.domain.order.entity.Order;
import com.alive.domain.order.entity.OrderStatus;
import com.alive.domain.order.repository.OrderRepository;
import com.alive.domain.payment.dto.PaymentConfirmRequest;
import com.alive.domain.payment.dto.PaymentResponse;
import com.alive.domain.payment.dto.TossConfirmResponse;
import com.alive.domain.payment.entity.Payment;
import com.alive.domain.payment.entity.PaymentStatus;
import com.alive.domain.payment.repository.PaymentRepository;
import com.alive.domain.user.entity.User;
import com.alive.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.Base64;
import java.util.Map;

/**
 * 결제 도메인 서비스. 토스페이먼츠(Toss Payments) 결제 승인 연동을 담당한다.
 */
@Service
@RequiredArgsConstructor
public class PaymentService {

    @Value("${toss.secret-key}")
    private String tossSecretKey;

    @Value("${toss.confirm-url}")
    private String tossConfirmUrl;

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    /**
     * 결제를 승인 처리한다. 클라이언트가 보낸 결제 금액을 서버에 저장된 주문 금액과 먼저 대조해
     * 위변조를 막은 뒤, 토스페이먼츠 실제 승인(confirm) API를 호출하고 결과를 저장하며 주문을 결제완료로 변경한다.
     */
    @Transactional
    public PaymentResponse confirmPayment(String email, PaymentConfirmRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        Order order = orderRepository.findByOrderNumberAndUserUserId(request.getOrderId(), user.getUserId())
                .orElseThrow(() -> new RuntimeException("주문을 찾을 수 없습니다"));

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new RuntimeException("결제 대기 중인 주문이 아닙니다");
        }
        if (order.getFinalAmount().compareTo(request.getAmount()) != 0) {
            throw new RuntimeException("결제 금액이 주문 금액과 일치하지 않습니다");
        }

        TossConfirmResponse tossResponse = requestTossConfirm(request);

        Payment payment = Payment.builder()
                .order(order)
                .paymentKey(tossResponse.getPaymentKey())
                .method(tossResponse.getMethod())
                .amount(request.getAmount())
                .status(PaymentStatus.DONE)
                .receiptUrl(tossResponse.getReceipt() != null ? tossResponse.getReceipt().getUrl() : null)
                .approvedAt(tossResponse.getApprovedAt() != null
                        ? OffsetDateTime.parse(tossResponse.getApprovedAt()).toLocalDateTime()
                        : null)
                .build();

        paymentRepository.save(payment);
        order.updateStatus(OrderStatus.PAID);

        return PaymentResponse.fromEntity(payment);
    }

    // 토스페이먼츠 결제 승인 API를 호출하여 결과를 받아온다.
    private TossConfirmResponse requestTossConfirm(PaymentConfirmRequest request) {
        String encodedAuth = Base64.getEncoder().encodeToString((tossSecretKey + ":").getBytes(StandardCharsets.UTF_8));

        return RestClient.create().post()
                .uri(tossConfirmUrl)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + encodedAuth)
                .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .body(Map.of(
                        "paymentKey", request.getPaymentKey(),
                        "orderId", request.getOrderId(),
                        "amount", request.getAmount()
                ))
                .retrieve()
                .onStatus(HttpStatusCode::isError, (req, res) -> {
                    String body = new String(res.getBody().readAllBytes(), StandardCharsets.UTF_8);
                    throw new RuntimeException("결제 승인에 실패했습니다: " + body);
                })
                .body(TossConfirmResponse.class);
    }
}
