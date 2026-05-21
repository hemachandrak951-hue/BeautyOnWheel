package com.beautyonwheel.config;

import com.beautyonwheel.entity.ServiceItem;
import com.beautyonwheel.entity.User;
import com.beautyonwheel.entity.User.UserRole;
import com.beautyonwheel.repository.ServiceItemRepository;
import com.beautyonwheel.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking database state for automatic seeding...");

        // 1. Seed Users if table is empty
        if (userRepository.count() == 0) {
            log.info("UserRepository is empty. Seeding local development users...");
            
            String defaultPasswordHash = passwordEncoder.encode("Test@123");

            User customer1 = User.builder()
                .name("Alice Johnson")
                .email("alice.johnson@example.com")
                .phone("+1-555-0101")
                .dateOfBirth(LocalDate.of(1995, 8, 12))
                .passwordHash(defaultPasswordHash)
                .role(UserRole.ROLE_CUSTOMER)
                .build();

            User customer2 = User.builder()
                .name("Bob Smith")
                .email("bob.smith@example.com")
                .phone("+1-555-0102")
                .dateOfBirth(LocalDate.of(1990, 4, 25))
                .passwordHash(defaultPasswordHash)
                .role(UserRole.ROLE_CUSTOMER)
                .build();

            User stylist = User.builder()
                .name("Emma Watson")
                .email("emma.watson@example.com")
                .phone("+1-555-0103")
                .dateOfBirth(LocalDate.of(1993, 11, 8))
                .passwordHash(defaultPasswordHash)
                .role(UserRole.ROLE_STYLIST)
                .build();

            userRepository.saveAll(List.of(customer1, customer2, stylist));
            log.info("Successfully seeded 3 local users (Alice, Bob, Emma).");
        } else {
            log.info("UserRepository already contains records. Skipping user seeding.");
        }

        // 2. Seed Service Items if table is empty
        if (serviceItemRepository.count() == 0) {
            log.info("ServiceItemRepository is empty. Seeding standard catalog services...");

            List<ServiceItem> services = List.of(
                // Facials
                ServiceItem.builder()
                    .name("Deep Cleanse Facial")
                    .category("Facial")
                    .price(new BigDecimal("45.00"))
                    .durationMinutes(60)
                    .description("Professional deep cleansing facial for all skin types")
                    .imageUrl("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build(),
                ServiceItem.builder()
                    .name("Hydrating Facial")
                    .category("Facial")
                    .price(new BigDecimal("55.00"))
                    .durationMinutes(60)
                    .description("Intensive hydration treatment for dry skin")
                    .imageUrl("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build(),
                ServiceItem.builder()
                    .name("Anti-Aging Facial")
                    .category("Facial")
                    .price(new BigDecimal("65.00"))
                    .durationMinutes(75)
                    .description("Advanced anti-aging treatment with premium serums")
                    .imageUrl("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build(),
                ServiceItem.builder()
                    .name("Acne Control Facial")
                    .category("Facial")
                    .price(new BigDecimal("50.00"))
                    .durationMinutes(60)
                    .description("Specialized treatment for acne-prone skin")
                    .imageUrl("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build(),

                // Makeup
                ServiceItem.builder()
                    .name("Bridal Glow Makeup")
                    .category("Makeup")
                    .price(new BigDecimal("80.00"))
                    .durationMinutes(90)
                    .description("Complete bridal makeup with HD finishing")
                    .imageUrl("https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build(),
                ServiceItem.builder()
                    .name("Party Makeup")
                    .category("Makeup")
                    .price(new BigDecimal("60.00"))
                    .durationMinutes(60)
                    .description("Glamorous party makeup with contouring")
                    .imageUrl("https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build(),
                ServiceItem.builder()
                    .name("Natural Everyday Makeup")
                    .category("Makeup")
                    .price(new BigDecimal("45.00"))
                    .durationMinutes(45)
                    .description("Light and natural everyday makeup look")
                    .imageUrl("https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build(),
                ServiceItem.builder()
                    .name("Eye Makeup Specialist")
                    .category("Makeup")
                    .price(new BigDecimal("35.00"))
                    .durationMinutes(30)
                    .description("Focused eye makeup design and application")
                    .imageUrl("https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build(),

                // Pedicure
                ServiceItem.builder()
                    .name("Classic Pedicure")
                    .category("Pedicure")
                    .price(new BigDecimal("40.00"))
                    .durationMinutes(45)
                    .description("Standard pedicure with nail care")
                    .imageUrl("https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build(),
                ServiceItem.builder()
                    .name("Paraffin Pedicure")
                    .category("Pedicure")
                    .price(new BigDecimal("55.00"))
                    .durationMinutes(60)
                    .description("Luxury pedicure with paraffin wax treatment")
                    .imageUrl("https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build(),
                ServiceItem.builder()
                    .name("Gel Pedicure")
                    .category("Pedicure")
                    .price(new BigDecimal("60.00"))
                    .durationMinutes(60)
                    .description("Long-lasting gel pedicure (2-3 weeks)")
                    .imageUrl("https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build(),
                ServiceItem.builder()
                    .name("Spa Pedicure Deluxe")
                    .category("Pedicure")
                    .price(new BigDecimal("75.00"))
                    .durationMinutes(90)
                    .description("Premium spa experience with massage and scrub")
                    .imageUrl("https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build(),

                // Hair
                ServiceItem.builder()
                    .name("Professional Haircut")
                    .category("Hair")
                    .price(new BigDecimal("35.00"))
                    .durationMinutes(45)
                    .description("Expert haircut with styling")
                    .imageUrl("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build(),
                ServiceItem.builder()
                    .name("Hair Color")
                    .category("Hair")
                    .price(new BigDecimal("50.00"))
                    .durationMinutes(90)
                    .description("Professional hair coloring service")
                    .imageUrl("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build(),
                ServiceItem.builder()
                    .name("Hair Spa Treatment")
                    .category("Hair")
                    .price(new BigDecimal("45.00"))
                    .durationMinutes(60)
                    .description("Deep conditioning and hair spa")
                    .imageUrl("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build(),
                ServiceItem.builder()
                    .name("Keratin Treatment")
                    .category("Hair")
                    .price(new BigDecimal("70.00"))
                    .durationMinutes(120)
                    .description("Smoothing keratin treatment (3-4 months)")
                    .imageUrl("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&auto=format&fit=crop&q=80")
                    .isActive(true)
                    .build()
            );

            serviceItemRepository.saveAll(services);
            log.info("Successfully seeded 16 catalog service items.");
        } else {
            log.info("ServiceItemRepository already contains records. Skipping service seeding.");
        }
        
        log.info("Automatic database seeding complete!");
    }
}
