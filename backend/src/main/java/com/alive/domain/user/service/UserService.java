package com.alive.domain.user.service;

import com.alive.domain.user.dto.LoginRequest;
import com.alive.domain.user.dto.LoginResponse;
import com.alive.domain.user.dto.RegisterRequest;
import com.alive.domain.user.dto.UserResponse;
import com.alive.domain.user.entity.User;
import com.alive.domain.user.entity.UserRole;
import com.alive.domain.user.repository.UserRepository;
import com.alive.security.JwtUtil;
import com.alive.security.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;  // 추가

    // 회원가입
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .name(request.getName())
                .phone(request.getPhone())
                .role(UserRole.USER)
                .build();

        User savedUser = userRepository.save(user);

        return UserResponse.fromEntity(savedUser);
    }

    // 로그인 (AccessToken + RefreshToken 발급)
    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("이메일 또는 비밀번호가 일치하지 않습니다"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("이메일 또는 비밀번호가 일치하지 않습니다");
        }

        // AccessToken 생성 (15분)
        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().name());

        // RefreshToken 생성 및 저장 (7일)
        String refreshToken = refreshTokenService.createRefreshToken(user.getEmail());

        return LoginResponse.builder()
                .accessToken(accessToken)      // AccessToken 추가
                .refreshToken(refreshToken)    // RefreshToken 추가
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .message("로그인 성공")
                .build();
    }

    // 사용자 정보 조회 (이메일로)
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        return UserResponse.fromEntity(user);
    }

    // 사용자 정보 조회 (ID로)
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        return UserResponse.fromEntity(user);
    }

    // 이메일 존재 여부 확인
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}