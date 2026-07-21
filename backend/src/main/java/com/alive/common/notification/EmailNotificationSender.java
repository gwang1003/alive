package com.alive.common.notification;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

/**
 * SMTP(Gmail)를 통한 이메일 발송 구현체.
 * 발송은 {@code @Async}로 별도 스레드에서 처리해, 메일 서버 지연이나 실패가
 * 주 요청(주문·재고수정 등)의 응답을 막거나 트랜잭션을 되돌리지 않도록 한다.
 */
@Slf4j
@Component
public class EmailNotificationSender implements NotificationSender {

    private final JavaMailSender mailSender;
    private final String from;

    public EmailNotificationSender(JavaMailSender mailSender,
                                   @Value("${spring.mail.username}") String from) {
        this.mailSender = mailSender;
        this.from = from;
    }

    @Async
    @Override
    public void send(String to, String subject, String content) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content);
            mailSender.send(message);
            log.info("이메일 발송 성공: to={}, subject={}", to, subject);
        } catch (Exception e) {
            // 비동기 발송이라 예외를 호출자에게 전파할 수 없으므로 로깅으로 남긴다.
            log.error("이메일 발송 실패: to={}, subject={}, error={}", to, subject, e.getMessage(), e);
        }
    }
}
