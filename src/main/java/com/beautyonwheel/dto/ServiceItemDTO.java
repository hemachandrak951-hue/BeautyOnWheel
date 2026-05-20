package com.beautyonwheel.dto;

import com.beautyonwheel.entity.ServiceItem;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Service Item Data Transfer Object for API responses
 * Represents salon services like facials, makeup, pedicure services
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceItemDTO {

    private Long id;

    private String name;

    private String category;

    private BigDecimal price;

    @JsonProperty("duration_minutes")
    private Integer durationMinutes;

    private String description;

    @JsonProperty("image_url")
    private String imageUrl;

    @JsonProperty("is_active")
    private Boolean isActive;

    /**
     * Convert ServiceItem entity to ServiceItemDTO
     * 
     * @param serviceItem The ServiceItem entity
     * @return ServiceItemDTO instance
     */
    public static ServiceItemDTO fromEntity(ServiceItem serviceItem) {
        return ServiceItemDTO.builder()
            .id(serviceItem.getId())
            .name(serviceItem.getName())
            .category(serviceItem.getCategory())
            .price(serviceItem.getPrice())
            .durationMinutes(serviceItem.getDurationMinutes())
            .description(serviceItem.getDescription())
            .imageUrl(serviceItem.getImageUrl())
            .isActive(serviceItem.getIsActive())
            .build();
    }
}
