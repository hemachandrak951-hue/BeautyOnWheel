package com.beautyonwheel.repository;

import com.beautyonwheel.entity.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for ServiceItem entity with custom query methods
 */
@Repository
public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {

    /**
     * Find active services filtered by category
     * 
     * @param category The service category
     * @return List of active services in the category
     */
    List<ServiceItem> findByCategoryAndIsActiveTrue(String category);

    /**
     * Get all active services
     * 
     * @return List of all active service items
     */
    List<ServiceItem> findByIsActiveTrue();

    /**
     * Get all unique categories for active services
     * 
     * @return List of distinct active categories
     */
    @Query("SELECT DISTINCT s.category FROM ServiceItem s WHERE s.isActive = true ORDER BY s.category")
    List<String> findAllActiveCategories();

    /**
     * Find a service by name
     * 
     * @param name The service name
     * @return Optional containing the service if found
     */
    Optional<ServiceItem> findByName(String name);
}
