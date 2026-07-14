package com.alive.domain.user.controller;

import com.alive.domain.user.dto.ChangePasswordRequest;
import com.alive.domain.user.dto.UpdateProfileRequest;
import com.alive.domain.user.dto.UserResponse;
import com.alive.domain.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
        UserResponse user = userService.getUserByEmail(currentEmail());
        return ResponseEntity.ok(user);
    }

    /**
     * 회원정보 수정 (이름, 전화번호)
     * PATCH /api/users/me
     */
    @PatchMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(currentEmail(), request));
    }

    /**
     * 비밀번호 변경
     * PATCH /api/users/me/password
     */
    @PatchMapping("/me/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(currentEmail(), request);
        return ResponseEntity.noContent().build();
    }

    private String currentEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
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
