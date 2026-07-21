package com.alive.common.notification;

/**
 * 사용자에게 알림을 발송하는 채널 추상화.
 * 현재는 이메일({@link EmailNotificationSender})만 구현돼 있으며,
 * 카카오 알림톡·SMS·푸시 등을 추가할 때 이 인터페이스를 구현하면 된다.
 */
public interface NotificationSender {

    /**
     * 알림을 발송한다.
     *
     * @param to      수신자 식별자 (이메일 주소 등)
     * @param subject 제목
     * @param content 본문
     */
    void send(String to, String subject, String content);
}
