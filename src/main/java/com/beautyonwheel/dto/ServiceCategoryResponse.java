package com.beautyonwheel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceCategoryResponse {

    private Long id;
    private String name;
    private String imageUrl;
    private String description;
    private Boolean isActive;
}
