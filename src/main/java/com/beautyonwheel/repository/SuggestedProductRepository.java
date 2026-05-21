package com.beautyonwheel.repository;

import com.beautyonwheel.entity.SuggestedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuggestedProductRepository extends JpaRepository<SuggestedProduct, Long> {

    List<SuggestedProduct> findByCustomerId(Long customerId);
}
