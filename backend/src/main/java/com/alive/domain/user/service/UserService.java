package com.alive.domain.user.service;

import com.alive.domain.user.dto.ChangePasswordRequest;
import com.alive.domain.user.dto.FindEmailRequest;
import com.alive.domain.user.dto.FindEmailResponse;
import com.alive.domain.user.dto.LoginRequest;
import com.alive.domain.user.dto.LoginResponse;
import com.alive.domain.user.dto.PasswordResetConfirmRequest;
import com.alive.domain.user.dto.PasswordResetLinkRequest;
import com.alive.domain.user.dto.RegisterRequest;
import com.alive.domain.user.dto.UpdateProfileRequest;
import com.alive.domain.user.dto.UserResponse;
import com.alive.domain.user.entity.AuthProvider;
import com.alive.domain.user.entity.EmailVerificationCode;
import com.alive.domain.user.entity.PasswordResetToken;
import com.alive.domain.user.entity.User;
import com.alive.domain.user.entity.UserRole;
import com.alive.domain.user.repository.EmailVerificationCodeRepository;
import com.alive.domain.user.repository.PasswordResetTokenRepository;
import com.alive.domain.user.repository.UserRepository;
import com.alive.common.notification.NotificationSender;
import com.alive.security.JwtUtil;
import com.alive.security.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;

/**
 * 회원가입, 로그인, 회원정보 조회/수정, 아이디·비밀번호 찾기, 소셜 로그인 계정 연동을 처리하는 서비스.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private static final int CODE_EXPIRY_MINUTES = 10;
    private static final int RESET_TOKEN_EXPIRY_MINUTES = 30;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;  // 추가
    private final EmailVerificationCodeRepository emailVerificationCodeRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final NotificationSender notificationSender;

    // 회원가입 (로컬 신규 가입은 미인증 상태로 만들고 6자리 인증코드를 메일로 발송)
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
                .emailVerified(false)  // 인증코드 확인 전까지 미인증
                .build();

        User savedUser = userRepository.save(user);

        issueAndSendCode(savedUser.getEmail());

        return UserResponse.fromEntity(savedUser);
    }

    // 이메일 인증코드 검증 → 성공 시 계정 활성화
    @Transactional
    public void verifyEmail(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("이미 인증된 계정입니다");
        }

        EmailVerificationCode saved = emailVerificationCodeRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("인증코드를 먼저 요청해주세요"));

        if (saved.isExpired()) {
            throw new RuntimeException("인증코드가 만료되었습니다. 재발송해주세요.");
        }
        if (!saved.getCode().equals(code)) {
            throw new RuntimeException("인증코드가 일치하지 않습니다");
        }

        user.verifyEmail();
        emailVerificationCodeRepository.delete(saved);
    }

    // 인증코드 재발송 (미인증 계정만)
    @Transactional
    public void resendVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("이미 인증된 계정입니다");
        }

        issueAndSendCode(email);
    }

    // 6자리 코드를 생성·저장(이메일당 최신 1개)하고 메일로 발송
    private void issueAndSendCode(String email) {
        String code = String.format("%06d", new Random().nextInt(1_000_000));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(CODE_EXPIRY_MINUTES);

        EmailVerificationCode entity = emailVerificationCodeRepository.findByEmail(email)
                .map(existing -> {
                    existing.refresh(code, expiresAt);
                    return existing;
                })
                .orElseGet(() -> EmailVerificationCode.builder()
                        .email(email)
                        .code(code)
                        .expiresAt(expiresAt)
                        .build());
        emailVerificationCodeRepository.save(entity);

        notificationSender.send(
                email,
                "[alive] 이메일 인증 코드",
                String.format("인증코드: %s%n%n%d분 안에 입력해주세요.%n%n- alive", code, CODE_EXPIRY_MINUTES)
        );
    }

    // 로그인 (AccessToken + RefreshToken 발급)
    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("이메일 또는 비밀번호가 일치하지 않습니다"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("이메일 또는 비밀번호가 일치하지 않습니다");
        }

        // 이메일 미인증 계정은 로그인 차단 (프론트에서 인증코드 입력/재발송으로 유도)
        if (!user.isEmailVerified()) {
            throw new RuntimeException("이메일 인증이 필요합니다. 가입 시 받은 6자리 인증코드를 입력해주세요.");
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

    // 비밀번호 재설정 링크 요청: 계정이 있으면 30분짜리 1회성 토큰을 메일로 발송한다.
    // 계정 존재 여부를 노출하지 않도록, 없는 이메일이어도 예외 없이 동일하게 처리한다.
    @Transactional
    public void requestPasswordReset(PasswordResetLinkRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String token = UUID.randomUUID().toString();
            LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(RESET_TOKEN_EXPIRY_MINUTES);

            PasswordResetToken entity = passwordResetTokenRepository.findByEmail(user.getEmail())
                    .map(existing -> {
                        existing.refresh(token, expiresAt);
                        return existing;
                    })
                    .orElseGet(() -> PasswordResetToken.builder()
                            .email(user.getEmail())
                            .token(token)
                            .expiresAt(expiresAt)
                            .build());
            passwordResetTokenRepository.save(entity);

            String link = frontendUrl + "/reset-password?token=" + token;
            notificationSender.send(
                    user.getEmail(),
                    "[alive] 비밀번호 재설정 안내",
                    String.format("아래 링크에서 비밀번호를 재설정해주세요. (%d분 내 유효)%n%n%s%n%n" +
                            "본인이 요청하지 않았다면 이 메일을 무시하세요.%n%n- alive",
                            RESET_TOKEN_EXPIRY_MINUTES, link)
            );
        });
    }

    // 비밀번호 재설정 확인: 링크의 토큰을 검증하고 새 비밀번호로 교체한 뒤 토큰을 폐기한다.
    @Transactional
    public void confirmPasswordReset(PasswordResetConfirmRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("유효하지 않은 재설정 링크입니다"));

        if (resetToken.isExpired()) {
            passwordResetTokenRepository.delete(resetToken);
            throw new RuntimeException("만료된 재설정 링크입니다. 다시 요청해주세요.");
        }

        User user = userRepository.findByEmail(resetToken.getEmail())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        user.changePassword(passwordEncoder.encode(request.getNewPassword()));
        passwordResetTokenRepository.delete(resetToken);
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