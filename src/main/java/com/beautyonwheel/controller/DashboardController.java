package com.beautyonwheel.controller;

import com.beautyonwheel.dto.DashboardResponse;
import com.beautyonwheel.dto.ServiceItemDTO;
import com.beautyonwheel.entity.SuggestedProduct;
import com.beautyonwheel.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Dashboard Controller for authenticated customer dashboard endpoints
 * All endpoints require valid JWT Bearer token in Authorization header
 * Protected under Spring Security with role-based access
 */
@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Get complete customer dashboard with user profile and services catalog
     * 
     * Security: Requires valid JWT token. Only accessible to CUSTOMER, STYLIST, and ADMIN roles.
     * The user context is automatically extracted from the JWT token via SecurityContextHolder.
     * 
     * @return 200 OK with DashboardResponse containing user profile and services grouped by category
     */
    @GetMapping("/home")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STYLIST', 'ADMIN')")
    public ResponseEntity<DashboardResponse> getCustomerDashboard() {
        log.info("Dashboard home request received");

        String userEmail = dashboardService.getCurrentUserEmail();
        log.debug("Authenticated user email: {}", userEmail);

        DashboardResponse dashboard = dashboardService.getDashboard(userEmail);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(dashboard);
    }

    /**
     * Get user's profile information
     * 
     * @return 200 OK with user profile data
     */
    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STYLIST', 'ADMIN')")
    public ResponseEntity<?> getUserProfile() {
        log.info("User profile request received");

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(dashboardService.getCurrentUserProfile());
    }

    /**
     * Get all active services grouped by category
     * 
     * @return 200 OK with services catalog map
     */
    @GetMapping("/services/catalog")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STYLIST', 'ADMIN')")
    public ResponseEntity<Map<String, List<ServiceItemDTO>>> getServicesCatalog() {
        log.info("Services catalog request received");

        Map<String, List<ServiceItemDTO>> catalog = dashboardService.getServicesCatalogByCategory();

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(catalog);
    }

    /**
     * Get services for a specific category
     * 
     * @param category The service category (e.g., "Facial", "Makeup", "Pedicure")
     * @return 200 OK with list of services in the category
     */
    @GetMapping("/services/category/{category}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STYLIST', 'ADMIN')")
    public ResponseEntity<List<ServiceItemDTO>> getServicesByCategory(
            @PathVariable String category) {
        log.info("Services by category request: {}", category);

        List<ServiceItemDTO> services = dashboardService.getServicesByCategory(category);

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(services);
    }

    /**
     * Get suggested products recommended by stylists for the authenticated user
     * 
     * @return 200 OK with list of suggested products
     */
    @GetMapping("/suggested-products")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STYLIST', 'ADMIN')")
    public ResponseEntity<List<SuggestedProduct>> getSuggestedProducts() {
        log.info("Suggested products request received");

        List<SuggestedProduct> products = dashboardService.getSuggestedProductsForCurrentUser();

        return ResponseEntity
            .status(HttpStatus.OK)
            .body(products);
    }
}
