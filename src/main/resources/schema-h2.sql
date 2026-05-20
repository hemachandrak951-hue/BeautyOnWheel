-- Schema initialization for H2 database with test data
-- This script runs on application startup to populate sample data

-- Insert sample users
INSERT INTO users (name, email, phone, password_hash, role, created_at, updated_at) VALUES 
('Alice Johnson', 'alice.johnson@example.com', '+1-555-0101', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36FhqnH2', 'ROLE_CUSTOMER', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO users (name, email, phone, password_hash, role, created_at, updated_at) VALUES 
('Bob Smith', 'bob.smith@example.com', '+1-555-0102', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36FhqnH2', 'ROLE_CUSTOMER', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO users (name, email, phone, password_hash, role, created_at, updated_at) VALUES 
('Emma Watson', 'emma.watson@example.com', '+1-555-0103', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36FhqnH2', 'ROLE_STYLIST', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert Facial services
INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Deep Cleanse Facial', 'Facial', 45.00, 60, 'Professional deep cleansing facial for all skin types', 'https://example.com/deep-cleanse.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Hydrating Facial', 'Facial', 55.00, 60, 'Intensive hydration treatment for dry skin', 'https://example.com/hydrating.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Anti-Aging Facial', 'Facial', 65.00, 75, 'Advanced anti-aging treatment with premium serums', 'https://example.com/anti-aging.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Acne Control Facial', 'Facial', 50.00, 60, 'Specialized treatment for acne-prone skin', 'https://example.com/acne.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert Makeup services
INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Bridal Glow Makeup', 'Makeup', 80.00, 90, 'Complete bridal makeup with HD finishing', 'https://example.com/bridal.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Party Makeup', 'Makeup', 60.00, 60, 'Glamorous party makeup with contouring', 'https://example.com/party.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Natural Everyday Makeup', 'Makeup', 45.00, 45, 'Light and natural everyday makeup look', 'https://example.com/natural.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Eye Makeup Specialist', 'Makeup', 35.00, 30, 'Focused eye makeup design and application', 'https://example.com/eye-makeup.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert Pedicure services
INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Classic Pedicure', 'Pedicure', 40.00, 45, 'Standard pedicure with nail care', 'https://example.com/classic-pedi.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Paraffin Pedicure', 'Pedicure', 55.00, 60, 'Luxury pedicure with paraffin wax treatment', 'https://example.com/paraffin-pedi.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Gel Pedicure', 'Pedicure', 60.00, 60, 'Long-lasting gel pedicure (2-3 weeks)', 'https://example.com/gel-pedi.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Spa Pedicure Deluxe', 'Pedicure', 75.00, 90, 'Premium spa experience with massage and scrub', 'https://example.com/spa-pedi.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert Hair services
INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Professional Haircut', 'Hair', 35.00, 45, 'Expert haircut with styling', 'https://example.com/haircut.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Hair Color', 'Hair', 50.00, 90, 'Professional hair coloring service', 'https://example.com/color.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Hair Spa Treatment', 'Hair', 45.00, 60, 'Deep conditioning and hair spa', 'https://example.com/hair-spa.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Keratin Treatment', 'Hair', 70.00, 120, 'Smoothing keratin treatment (3-4 months)', 'https://example.com/keratin.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
