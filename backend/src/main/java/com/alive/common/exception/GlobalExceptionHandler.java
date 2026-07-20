package com.alive.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 전역 예외 처리기. 컨트롤러에서 발생한 예외를 잡아 일관된 ErrorResponse 형식으로 응답한다.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * @Valid 검증 실패 (요청 DTO의 필드 검증 오류). HTTP 400 Bad Request로 응답한다.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(FieldError::getDefaultMessage)
                .orElse("입력값이 올바르지 않습니다");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), message));
    }

    /**
     * 잘못된 인자로 인한 예외. HTTP 400 Bad Request로 응답한다.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
    }

    /**
     * 도메인 서비스 계층에서 던지는 비즈니스 예외
     * (예: "상품을 찾을 수 없습니다", "이미 사용 중인 이메일입니다" 등). HTTP 400 Bad Request로 응답한다.
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException e) {
        log.warn("비즈니스 예외 발생: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST.value(), e.getMessage()));
    }

    /**
     * 예상하지 못한 서버 오류. 상세 메시지는 클라이언트에 노출하지 않고 서버 로그에만 남긴다.
     * HTTP 500 Internal Server Error로 응답한다.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {
        log.error("예상하지 못한 서버 오류", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of(HttpStatus.INTERNAL_SERVER_ERROR.value(), "서버 오류가 발생했습니다"));
    }
}
