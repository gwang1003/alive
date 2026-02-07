package com.alive.domain.user.controller;


import com.alive.domain.user.dto.LoginRequest;
import com.alive.domain.user.dto.LoginResponse;
import com.alive.domain.user.dto.RegisterRequest;
import com.alive.domain.user.dto.UserResponse;
import com.alive.domain.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    /**
     * 회원가입
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse response = userService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 로그인
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * 이메일 중복 체크
     * GET /api/auth/check-email?email=test@example.com
     */
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmailDuplicate(@RequestParam String email) {
        // true: 사용 가능, false: 이미 사용중
        boolean available = !userService.isEmailExists(email);
        return ResponseEntity.ok(available);
    }
}