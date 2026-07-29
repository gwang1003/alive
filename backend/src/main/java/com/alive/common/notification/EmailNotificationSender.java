package com.alive.common.notification;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;

/**
 * Brevo(구 Sendinblue) HTTP API를 통한 이메일 발송 구현체.
 * Railway의 SMTP 포트 차단 우회를 위해 SMTP 대신 HTTPS REST API를 사용한다.
 * @Async로 별도 스레드에서 처리해 메일 지연·실패가 주 요청을 막지 않도록 한다.
 */
@Slf4j
@Component
public class EmailNotificationSender implements NotificationSender {

    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
    private static final HttpClient HTTP_CLIENT = HttpClient.newHttpClient();
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final String apiKey;
    private final String senderEmail;

    public EmailNotificationSender(
            @Value("${brevo.api-key}") String apiKey,
            @Value("${spring.mail.username:gwang1003@gmail.com}") String senderEmail) {
        this.apiKey = apiKey;
        this.senderEmail = senderEmail;
    }

    @Async
    @Override
    public void send(String to, String subject, String content) {
        try {
            Map<String, Object> body = Map.of(
                    "sender", Map.of("name", "alive", "email", senderEmail),
                    "to", List.of(Map.of("email", to)),
                    "subject", subject,
                    "textContent", content
            );

            String jsonBody = OBJECT_MAPPER.writeValueAsString(body);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(BREVO_API_URL))
                    .header("api-key", apiKey)
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                log.info("이메일 발송 성공: to={}, subject={}", to, subject);
            } else {
                log.error("이메일 발송 실패: to={}, subject={}, status={}, body={}",
                        to, subject, response.statusCode(), response.body());
            }
        } catch (Exception e) {
            log.error("이메일 발송 실패: to={}, subject={}, error={}", to, subject, e.getMessage(), e);
        }
    }
}
