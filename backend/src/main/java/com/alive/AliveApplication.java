package com.alive;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * alive(키즈 패션 쇼핑몰) 백엔드 애플리케이션 엔트리 포인트
 */
@SpringBootApplication
@EnableScheduling  // ← 스케줄러 활성화
public class AliveApplication {

    /**
     * 스프링 부트 애플리케이션을 구동한다.
     */
    public static void main(String[] args) {
        SpringApplication.run(AliveApplication.class, args);
    }

}
