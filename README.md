# alive (Alive Kids) 🧸

유아동 패션 이커머스 **풀스택 프로젝트**. 상품·장바구니·주문·결제부터 소셜 로그인, 이메일 인증, 관리자 대시보드까지 실제 쇼핑몰의 핵심 기능을 구현했습니다.

<!-- 데모 스크린샷 / 배포 URL 추가 예정 -->

---

## ✨ 주요 기능

### 고객
- 상품 목록 · 상세 · 검색 · 카테고리 필터, 최근 본 상품
- 장바구니, 주문/결제 (**TossPayments**), 주문 내역/취소
- **카카오 · 네이버 소셜 로그인** (OAuth 2.0)
- **회원가입 이메일 인증**(6자리 코드), **비밀번호 재설정**(이메일 링크)
- 포토 리뷰, 위시리스트, **재입고 알림**(이메일 발송), 1:1 문의, 배송지 관리

### 관리자
- 상품 · 재고 · 주문 · 배너 · 문의 관리 (URL + 메서드 이중 권한 검증)

---

## 🛠 기술 스택

| 영역 | 기술 |
|------|------|
| **Backend** | Java 21, Spring Boot 3.2, Spring Security (JWT), Spring Data JPA / Hibernate, PostgreSQL, Spring Mail |
| **Frontend** | React 19, TypeScript, Vite, Zustand, Axios, Tailwind CSS, React Router v7 |
| **연동** | TossPayments, Kakao · Naver OAuth 2.0, Gmail SMTP |

---

## 🏗 아키텍처 특징

- **도메인 기반 패키지 구조** — 11개 도메인(user, product, order, cart, payment, review, inquiry, banner, restock, address, wishlist)이 동일한 계층 구조를 따름
- **JWT 이중 토큰** — AccessToken(15분) + RefreshToken(7일, HttpOnly 쿠키) 회전 방식, 서버 측 무효화 지원
- **주문 스냅샷** — OrderItem에 상품 정보를 비정규화 저장해 상품 삭제/변경에도 과거 주문 이력을 온전히 보존

---

## 🔍 기술적으로 공들인 부분

- **결제 금액 위변조 방어** — 결제 승인 전, 클라이언트가 보낸 금액을 신뢰하지 않고 DB에 저장된 주문 금액과 대조 검증
- **재고 동시성 제어** — 재고 차감/복원에 비관적 락(`SELECT ... FOR UPDATE`)을 적용하고 잠금 순서를 고정(데드락 회피)해, 동시 주문 시 초과 판매·재고 음수를 방지
- **인증 보안** — JWT 회전 + 회원가입 이메일 인증(6자리 코드) + 비밀번호 재설정 링크(1회성 토큰, 계정 열거 방지)로 계정 보안 강화
- **비동기 이메일 발송** — `NotificationSender` 인터페이스로 채널을 추상화하고 `@Async`로 주 트랜잭션과 격리(메일 지연·실패가 주문 처리를 막지 않음)

---

## 🚀 실행 방법

### 사전 준비
- JDK 21, Node.js, PostgreSQL

### Backend
```bash
# 1) 시크릿 파일 생성: 예시를 복사해 실제 값 입력
cp backend/src/main/resources/application-secret.yml.example \
   backend/src/main/resources/application-secret.yml

# 2) 실행 (포트 8282)
cd backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev   # 포트 3000 (백엔드 CORS 허용 오리진)
```

---

## 📌 프로젝트 정보
- **개발**: 1인 (기획 · 백엔드 · 프론트엔드 · DB · 외부 연동)
- **기간**: 2026.02 ~ 2026.07
