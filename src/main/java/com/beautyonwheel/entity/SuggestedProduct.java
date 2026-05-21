package com.beautyonwheel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "suggested_products", indexes = {
    @Index(name = "idx_suggested_products_customer", columnList = "customer_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuggestedProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Customer ID is required")
    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @NotBlank(message = "Stylist name is required")
    @Column(name = "stylist_name", nullable = false)
    private String stylistName;

    @NotBlank(message = "Product name is required")
    @Column(name = "product_name", nullable = false)
    private String productName;

    @NotBlank(message = "Description is required")
    @Column(nullable = false, length = 1000)
    private String description;

    @NotBlank(message = "Store platform is required")
    @Column(name = "store_platform", nullable = false)
    private String storePlatform;

    @NotBlank(message = "Affiliate URL is required")
    @Column(name = "affiliate_url", nullable = false, length = 1000)
    private String affiliateUrl;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false, name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
