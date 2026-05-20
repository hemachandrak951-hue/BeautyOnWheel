package com.beautyonwheel.service;

import com.beautyonwheel.dto.ServiceCategoryResponse;
import com.beautyonwheel.entity.ServiceCategory;
import com.beautyonwheel.repository.ServiceCategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ServiceCategoryService {

    private final ServiceCategoryRepository serviceCategoryRepository;

    @Transactional(readOnly = true)
    public List<ServiceCategoryResponse> getAllActiveCategories() {
        log.debug("Fetching all active service categories");
        
        return serviceCategoryRepository.findByIsActiveTrue()
            .stream()
            .map(this::mapToResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public ServiceCategoryResponse getCategoryById(Long categoryId) {
        ServiceCategory category = serviceCategoryRepository.findById(categoryId)
            .orElseThrow(() -> {
                log.warn("Category not found with id: {}", categoryId);
                return new IllegalArgumentException("Service category not found");
            });

        return mapToResponse(category);
    }

    private ServiceCategoryResponse mapToResponse(ServiceCategory category) {
        return ServiceCategoryResponse.builder()
            .id(category.getId())
            .name(category.getName())
            .imageUrl(category.getImageUrl())
            .description(category.getDescription())
            .isActive(category.getIsActive())
            .build();
    }
}
