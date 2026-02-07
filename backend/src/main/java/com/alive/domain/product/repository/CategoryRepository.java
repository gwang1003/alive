package com.alive.domain.product.repository;

import com.alive.domain.product.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // 최상위 카테고리 조회 (parent가 null인 것들)
    List<Category> findByParentIsNull();

    // 특정 카테고리의 하위 카테고리 조회
    List<Category> findByParent(Category parent);

    // 특정 카테고리의 하위 카테고리 조회 (ID로)
    List<Category> findByParentCategoryId(Long parentId);

    // 이름으로 카테고리 찾기
    List<Category> findByNameContaining(String name);

    // display_order 순으로 정렬하여 조회
    List<Category> findAllByOrderByDisplayOrderAsc();
}