package com.alive.domain.user.service;
import com.alive.domain.user.dto.LoginRequest;
import com.alive.domain.user.dto.LoginResponse;
import com.alive.domain.user.dto.RegisterRequest;
import com.alive.domain.user.dto.UserResponse;
import com.alive.domain.user.entity.User;
import com.alive.domain.user.entity.UserRole;
import com.alive.domain.user.repository.UserRepository;
import com.alive.security.JwtUtil;
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

    // 회원가입
    @Transactional
    public UserResponse register(RegisterRequest request) {
        // 1. 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다");
        }

        // 2. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        // 3. 사용자 엔티티 생성
        User user = User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .name(request.getName())
                .phone(request.getPhone())
                .role(UserRole.USER)
                .build();

        // 4. 저장
        User savedUser = userRepository.save(user);

        // 5. DTO로 변환하여 반환
        return UserResponse.fromEntity(savedUser);
    }

    // 로그인
    public LoginResponse login(LoginRequest request) {
        // 1. 이메일로 사용자 찾기
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("이메일 또는 비밀번호가 일치하지 않습니다"));

        // 2. 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("이메일 또는 비밀번호가 일치하지 않습니다");
        }

        // 3. JWT 토큰 생성
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        // 4. LoginResponse 생성 및 반환
        return LoginResponse.builder()
                .token(token)
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

    // 이메일 존재 여부 확인 (추가)
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}