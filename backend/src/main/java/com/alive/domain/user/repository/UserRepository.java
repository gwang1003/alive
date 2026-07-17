package com.alive.domain.user.repository;

import com.alive.domain.user.entity.AuthProvider;
import com.alive.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 이메일로 사용자 찾기
    Optional<User> findByEmail(String email);

    // 이메일 중복 체크
    boolean existsByEmail(String email);

    // 전화번호로 사용자 찾기
    Optional<User> findByPhone(String phone);

    // 아이디 찾기: 이름 + 전화번호로 본인확인
    Optional<User> findByNameAndPhone(String name, String phone);

    // 비밀번호 찾기: 이메일 + 이름 + 전화번호로 본인확인
    Optional<User> findByEmailAndNameAndPhone(String email, String name, String phone);

    // 소셜 로그인: 제공자 + 제공자 고유 ID로 기존 연동 계정 조회
    Optional<User> findByProviderAndProviderId(AuthProvider provider, String providerId);
}