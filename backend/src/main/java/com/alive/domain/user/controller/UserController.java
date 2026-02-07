package com.alive.domain.user.controller;

import com.alive.domain.user.dto.UserResponse;
import com.alive.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    /**
     * 현재 로그인한 사용자 정보 조회
     * GET /api/users/me
     * 인증 필요 (JWT 토큰)
     */
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        // SecurityContext에서 현재 인증된 사용자 이메일 가져오기
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // principal (이메일)

        UserResponse user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    /**
     * 관리자 전용 API (테스트)
     * GET /api/users/admin-only
     * ADMIN 권한 필요
     */
    @GetMapping("/admin-only")
    public ResponseEntity<String> adminOnly() {
        return ResponseEntity.ok("관리자만 볼 수 있는 정보입니다");
    }
}
