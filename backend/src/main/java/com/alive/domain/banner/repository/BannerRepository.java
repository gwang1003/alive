package com.alive.domain.banner.repository;

import com.alive.domain.banner.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 배너 리포지토리
 */
@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {

    /** 활성 배너를 노출 순서대로 조회 */
    List<Banner> findByIsActiveTrueOrderByDisplayOrderAsc();

    /** 전체 배너를 노출 순서대로 조회 */
    List<Banner> findAllByOrderByDisplayOrderAsc();
}
