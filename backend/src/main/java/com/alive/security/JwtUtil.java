package com.alive.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * JWT AccessToken/RefreshToken의 생성, 파싱, 검증을 담당하는 유틸리티.
 * 토큰의 subject는 이메일이며, "type" 클레임(access/refresh)으로 두 토큰 종류를 구분한다.
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access-token-expiration}")
    private Long accessTokenExpiration;  // 15분 (900000ms)

    @Value("${jwt.refresh-token-expiration}")
    private Long refreshTokenExpiration; // 7일 (604800000ms)

    /**
     * 설정된 secret으로 HMAC 서명 키 생성
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ========== AccessToken 생성 ==========

    /**
     * AccessToken 발급 (role 클레임 포함, type=access)
     */
    public String generateAccessToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("type", "access");  // 토큰 타입 구분

        return createToken(claims, email, accessTokenExpiration);
    }

    // ========== RefreshToken 생성 ==========

    /**
     * RefreshToken 발급 (type=refresh)
     */
    public String generateRefreshToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");  // 토큰 타입 구분

        return createToken(claims, email, refreshTokenExpiration);
    }

    // ========== 토큰 생성 핵심 로직 ==========

    /**
     * 클레임/subject/만료시간으로 서명된 JWT 문자열 생성
     */
    private String createToken(Map<String, Object> claims, String subject, Long expiration) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    // ========== 토큰에서 정보 추출 ==========

    /**
     * 토큰의 subject(이메일) 추출
     */
    public String getEmailFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    /**
     * 토큰의 role 클레임 추출
     */
    public String getRoleFromToken(String token) {
        return getClaimFromToken(token, claims -> claims.get("role", String.class));
    }

    /**
     * 토큰의 type 클레임(access/refresh) 추출
     */
    public String getTokenType(String token) {
        return getClaimFromToken(token, claims -> claims.get("type", String.class));
    }

    /**
     * 토큰의 만료 시각 추출
     */
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    /**
     * 토큰의 전체 클레임을 파싱한 뒤 원하는 값만 골라 반환하는 공용 헬퍼
     */
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    /**
     * 서명 검증 후 토큰의 전체 클레임(payload) 파싱. 서명이 유효하지 않으면 예외 발생
     */
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // ========== 토큰 검증 ==========

    /**
     * 만료 시각이 현재 시각보다 이전인지 확인
     */
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    /**
     * 토큰의 이메일이 주어진 이메일과 일치하고 만료되지 않았는지 검증
     */
    public Boolean validateToken(String token, String email) {
        final String tokenEmail = getEmailFromToken(token);
        return (tokenEmail.equals(email) && !isTokenExpired(token));
    }

    /**
     * 서명이 유효하고 만료되지 않았는지 검증 (파싱 실패 시 false)
     */
    public Boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    // ========== AccessToken 검증 (타입 체크 포함) ==========

    /**
     * 토큰이 유효하고 type이 access인지 검증
     */
    public Boolean validateAccessToken(String token) {
        try {
            if (!validateToken(token)) {
                return false;
            }
            String type = getTokenType(token);
            return "access".equals(type);
        } catch (Exception e) {
            return false;
        }
    }

    // ========== RefreshToken 검증 (타입 체크 포함) ==========

    /**
     * 토큰이 유효하고 type이 refresh인지 검증
     */
    public Boolean validateRefreshToken(String token) {
        try {
            if (!validateToken(token)) {
                return false;
            }
            String type = getTokenType(token);
            return "refresh".equals(type);
        } catch (Exception e) {
            return false;
        }
    }
}