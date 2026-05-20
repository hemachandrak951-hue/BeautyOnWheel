package com.beautyonwheel.service;

import com.beautyonwheel.dto.DashboardResponse;
import com.beautyonwheel.dto.ServiceItemDTO;
import com.beautyonwheel.dto.UserDTO;
import com.beautyonwheel.entity.ServiceItem;
import com.beautyonwheel.entity.User;
import com.beautyonwheel.exception.ResourceNotFoundException;
import com.beautyonwheel.repository.ServiceItemRepository;
import com.beautyonwheel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for building and retrieving customer dashboard data
 * Aggregates user profile and services catalog grouped by category
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final UserRepository userRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final AuthService authService;

    /**
     * Get complete dashboard response for the authenticated user
     * Includes user profile and services catalog grouped by category
     * 
     * @param userEmail The authenticated user's email
     * @return DashboardResponse with user profile and services catalog
     * @throws ResourceNotFoundException if user not found
     */
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(String userEmail) {
        log.info("Fetching dashboard for user: {}", userEmail);

        // Fetch authenticated user
        User user = authService.getUserByEmail(userEmail);
        UserDTO userProfile = UserDTO.fromEntity(user);

        // Fetch and group services by category
        Map<String, List<ServiceItemDTO>> servicesCatalog = getServicesCatalogByCategory();

        log.info("Dashboard fetched successfully for user: {} with {} categories", 
            userEmail, servicesCatalog.size());

        return DashboardResponse.builder()
            .userProfile(userProfile)
            .servicesCatalog(servicesCatalog)
            .status("success")
            .timestamp(System.currentTimeMillis())
            .build();
    }

    /**
     * Get all active services grouped by category
     * Returns a map with category names as keys and list of services as values
     * 
     * @return Map of services grouped by category
     */
    @Transactional(readOnly = true)
    public Map<String, List<ServiceItemDTO>> getServicesCatalogByCategory() {
        log.debug("Fetching services catalog");

        // Get all active services
        List<ServiceItem> activeServices = serviceItemRepository.findByIsActiveTrue();

        // Group by category, sorted by category name
        return activeServices.stream()
            .map(ServiceItemDTO::fromEntity)
            .collect(Collectors.groupingBy(
                ServiceItemDTO::getCategory,
                Collectors.collectingAndThen(
                    Collectors.toList(),
                    this::sortServicesByName
                )
            ))
            .entrySet()
            .stream()
            .sorted(Map.Entry.comparingByKey())
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                Map.Entry::getValue,
                (e1, e2) -> e1,
                LinkedHashMap::new
            ));
    }

    /**
     * Get services for a specific category
     * 
     * @param category The category name
     * @return List of services in the category
     */
    @Transactional(readOnly = true)
    public List<ServiceItemDTO> getServicesByCategory(String category) {
        log.debug("Fetching services for category: {}", category);

        return serviceItemRepository.findByCategoryAndIsActiveTrue(category)
            .stream()
            .map(ServiceItemDTO::fromEntity)
            .sorted(Comparator.comparing(ServiceItemDTO::getName))
            .collect(Collectors.toList());
    }

    /**
     * Validate current user's authentication context
     * Extracts user email from SecurityContextHolder
     * 
     * @return Authenticated user's email
     * @throws IllegalStateException if user is not authenticated
     */
    public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() 
            || "anonymousUser".equals(authentication.getPrincipal())) {
            log.warn("Attempt to get current user without valid authentication");
            throw new IllegalStateException("User is not authenticated");
        }

        return authentication.getName();
    }

    /**
     * Get authenticated user's profile
     * 
     * @return UserDTO of the authenticated user
     */
    @Transactional(readOnly = true)
    public UserDTO getCurrentUserProfile() {
        String userEmail = getCurrentUserEmail();
        User user = authService.getUserByEmail(userEmail);
        return UserDTO.fromEntity(user);
    }

    /**
     * Sort services by name for consistent ordering
     * 
     * @param services List of services to sort
     * @return Sorted list of services
     */
    private List<ServiceItemDTO> sortServicesByName(List<ServiceItemDTO> services) {
        return services.stream()
            .sorted(Comparator.comparing(ServiceItemDTO::getName))
            .collect(Collectors.toList());
    }
}
