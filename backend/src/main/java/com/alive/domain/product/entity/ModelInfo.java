package com.alive.domain.product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "model_info")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModelInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "model_info_id")
    private Long modelInfoId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "model_name", length = 100)
    private String modelName;

    @Column(name = "height")
    private Integer height;

    @Column(name = "weight")
    private Integer weight;

    @Column(name = "wearing_color", length = 50)
    private String wearingColor;

    @Column(name = "wearing_size")
    private Integer wearingSize;
}