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

@Slf4j
@Component
public class EmailNotificationSender implements NotificationSender {

    private static final String RESEND_API_URL = "https://api.resend.com/emails";
    private static final HttpClient HTTP_CLIENT = HttpClient.newHttpClient();
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final String apiKey;
    private final String senderEmail;

    public EmailNotificationSender(
            @Value("${resend.api-key}") String apiKey,
            @Value("${resend.sender-email:noreply@alive-kids.shop}") String senderEmail) {
        this.apiKey = apiKey;
        this.senderEmail = senderEmail;
    }

    @Async
    @Override
    public void send(String to, String subject, String content) {
        try {
            Map<String, Object> body = Map.of(
                    "from", "alive <" + senderEmail + ">",
                    "to", List.of(to),
                    "subject", subject,
                    "text", content
            );

            String jsonBody = OBJECT_MAPPER.writeValueAsString(body);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(RESEND_API_URL))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
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
