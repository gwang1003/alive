package com.alive.domain.user.service;

import com.alive.domain.user.dto.ChangePasswordRequest;
import com.alive.domain.user.dto.FindEmailRequest;
import com.alive.domain.user.dto.FindEmailResponse;
import com.alive.domain.user.dto.LoginRequest;
import com.alive.domain.user.dto.LoginResponse;
import com.alive.domain.user.dto.RegisterRequest;
import com.alive.domain.user.dto.ResetPasswordRequest;
import com.alive.domain.user.dto.UpdateProfileRequest;
import com.alive.domain.user.dto.UserResponse;
import com.alive.domain.user.entity.AuthProvider;
import com.alive.domain.user.entity.User;
import com.alive.domain.user.entity.UserRole;
import com.alive.domain.user.repository.UserRepository;
import com.alive.security.JwtUtil;
import com.alive.security.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

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

    // 회원정보 수정 (이름, 전화번호)
    @Transactional
    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        user.updateProfile(request.getName(), request.getPhone());

        return UserResponse.fromEntity(user);
    }

    // 비밀번호 변경
    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("현재 비밀번호가 일치하지 않습니다");
        }

        user.changePassword(passwordEncoder.encode(request.getNewPassword()));
    }

    // 아이디 찾기: 이름 + 전화번호가 일치하는 회원의 이메일을 마스킹해서 반환
    public FindEmailResponse findEmail(FindEmailRequest request) {
        User user = userRepository.findByNameAndPhone(request.getName(), request.getPhone())
                .orElseThrow(() -> new RuntimeException("일치하는 회원 정보가 없습니다"));

        return FindEmailResponse.builder()
                .maskedEmail(maskEmail(user.getEmail()))
                .build();
    }

    // 비밀번호 찾기: 이메일 + 이름 + 전화번호로 본인확인 후 새 비밀번호로 즉시 재설정
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmailAndNameAndPhone(
                        request.getEmail(), request.getName(), request.getPhone())
                .orElseThrow(() -> new RuntimeException("일치하는 회원 정보가 없습니다"));

        user.changePassword(passwordEncoder.encode(request.getNewPassword()));
    }

    // 소셜 로그인: 이미 연동된 계정이면 그대로, 처음이면 새로 만들어서 반환
    // (email이 null인 경우 카카오/네이버가 이메일 제공 동의를 안 받은 경우 - provider별 임시 이메일 생성)
    @Transactional
    public User findOrCreateOAuthUser(AuthProvider provider, String providerId, String email, String name) {
        return userRepository.findByProviderAndProviderId(provider, providerId)
                .orElseGet(() -> {
                    String finalEmail = email != null ? email : provider.name().toLowerCase() + "_" + providerId + "@oauth.local";

                    if (userRepository.existsByEmail(finalEmail)) {
                        throw new RuntimeException("이미 다른 방식으로 가입된 이메일입니다. 이메일/비밀번호로 로그인해주세요.");
                    }

                    User user = User.builder()
                            .email(finalEmail)
                            // 소셜 로그인 계정은 비밀번호 로그인을 쓰지 않으므로 알 수 없는 임의값을 암호화해 채워둔다
                            .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                            .name(name != null ? name : provider.name() + " 사용자")
                            .role(UserRole.USER)
                            .provider(provider)
                            .providerId(providerId)
                            .build();

                    return userRepository.save(user);
                });
    }

    private String maskEmail(String email) {
        int atIndex = email.indexOf('@');
        String local = email.substring(0, atIndex);
        String domain = email.substring(atIndex);
        String visible = local.length() <= 2 ? local.substring(0, 1) : local.substring(0, 2);
        return visible + "***" + domain;
    }
}