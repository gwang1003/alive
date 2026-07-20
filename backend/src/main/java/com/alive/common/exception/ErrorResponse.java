package com.alive.common.exception;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 에러 응답 공통 포맷 (HTTP 상태 코드, 메시지, 발생 시각)
 */
@Getter
@Builder
public class ErrorResponse {

    private int status;
    private String message;
    private LocalDateTime timestamp;

    /**
     * 상태 코드와 메시지로 ErrorResponse를 생성한다.
     */
    public static ErrorResponse of(int status, String message) {
        return ErrorResponse.builder()
                .status(status)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
