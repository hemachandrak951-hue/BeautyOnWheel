package com.beautyonwheel.controller;

import com.beautyonwheel.dto.ServiceCategoryResponse;
import com.beautyonwheel.service.ServiceCategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/home")
@RequiredArgsConstructor
@Slf4j
public class HomeController {

    private final ServiceCategoryService serviceCategoryService;

    /**
     * Get all active service categories for homepage display
     * Public endpoint - no authentication required
     * 
     * @return 200 OK with list of active service categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<ServiceCategoryResponse>> getAllCategories() {
        log.info("Fetching all active service categories for homepage");
        
        List<ServiceCategoryResponse> categories = serviceCategoryService.getAllActiveCategories();
        
        return ResponseEntity
            .status(HttpStatus.OK)
            .body(categories);
    }
}
