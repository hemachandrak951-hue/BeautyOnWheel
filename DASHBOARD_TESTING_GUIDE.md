# Beauty On Wheel - Customer Dashboard API Testing Guide

## Server Status
✅ **Server Running**: http://localhost:8080  
✅ **All 3 Repositories Initialized**: UserRepository, ServiceItemRepository, ServiceCategoryRepository  
✅ **JWT Authentication Filter**: Active and ready  
✅ **CORS Configuration**: Enabled for Angular frontend (localhost:4200)  

---

## QUICK START - TESTING THE DASHBOARD

### Step 1: Register a Test User

```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice.johnson@example.com",
    "phone": "+1-555-0101",
    "password": "Test@123",
    "dateOfBirth": "1995-05-15",
    "role": "ROLE_CUSTOMER"
  }'
```

**Expected Response (201 Created)**:
```json
{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "phone": "+1-555-0101",
  "date_of_birth": "1995-05-15",
  "role": "ROLE_CUSTOMER",
  "created_at": "2026-05-20T18:34:15"
}
```

---

### Step 2: Login and Get JWT Token

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "alice.johnson@example.com",
    "password": "Test@123"
  }'
```

**Expected Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbGljZS5qb2huc29uQGV4YW1wbGUuY29tIiwidXNlcklkIjoiMSIsInJvbGUiOiJST0xFX0NVU1RPTUVSIn0.signature...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice.johnson@example.com",
    "phone": "+1-555-0101",
    "role": "ROLE_CUSTOMER"
  }
}
```

**Save the `access_token` for the next steps!**

---

### Step 3: Initialize Test Data (Insert Services)

Insert sample services into the database using H2 Console or SQL scripts.

```bash
# Using H2 Console: http://localhost:8080/h2-console
# JDBC URL: jdbc:h2:mem:beautyonwheel_local
# User: SA
# Password: (empty)

-- Insert Facial Services
INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Deep Cleanse Facial', 'Facial', 45.00, 60, 'Professional deep cleansing facial', 'https://example.com/deep.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Hydrating Facial', 'Facial', 55.00, 60, 'Intensive hydration treatment', 'https://example.com/hydrate.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert Makeup Services
INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Bridal Glow Makeup', 'Makeup', 80.00, 90, 'Complete bridal makeup', 'https://example.com/bridal.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Party Makeup', 'Makeup', 60.00, 60, 'Glamorous party makeup', 'https://example.com/party.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert Pedicure Services
INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Classic Pedicure', 'Pedicure', 40.00, 45, 'Standard pedicure', 'https://example.com/classic.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

INSERT INTO service_items (name, category, price, duration_minutes, description, image_url, is_active, created_at, updated_at) VALUES 
('Paraffin Pedicure', 'Pedicure', 55.00, 60, 'Luxury pedicure with paraffin', 'https://example.com/paraffin.jpg', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
```

---

### Step 4: Access Dashboard Home (⭐ MAIN ENDPOINT)

This endpoint combines user profile + services catalog grouped by category (Amazon/Flipkart style):

```bash
curl -X GET http://localhost:8080/api/v1/dashboard/home \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
```

**Response (200 OK)**:
```json
{
  "user_profile": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice.johnson@example.com",
    "phone": "+1-555-0101",
    "date_of_birth": "1995-05-15",
    "role": "ROLE_CUSTOMER",
    "created_at": "2026-05-20T18:34:15",
    "updated_at": "2026-05-20T18:34:15"
  },
  "services_catalog": {
    "Facial": [
      {
        "id": 1,
        "name": "Deep Cleanse Facial",
        "category": "Facial",
        "price": 45.00,
        "duration_minutes": 60,
        "description": "Professional deep cleansing facial",
        "image_url": "https://example.com/deep.jpg",
        "is_active": true
      },
      {
        "id": 2,
        "name": "Hydrating Facial",
        "category": "Facial",
        "price": 55.00,
        "duration_minutes": 60,
        "description": "Intensive hydration treatment",
        "image_url": "https://example.com/hydrate.jpg",
        "is_active": true
      }
    ],
    "Makeup": [
      {
        "id": 3,
        "name": "Bridal Glow Makeup",
        "category": "Makeup",
        "price": 80.00,
        "duration_minutes": 90,
        "description": "Complete bridal makeup",
        "image_url": "https://example.com/bridal.jpg",
        "is_active": true
      },
      {
        "id": 4,
        "name": "Party Makeup",
        "category": "Makeup",
        "price": 60.00,
        "duration_minutes": 60,
        "description": "Glamorous party makeup",
        "image_url": "https://example.com/party.jpg",
        "is_active": true
      }
    ],
    "Pedicure": [
      {
        "id": 5,
        "name": "Classic Pedicure",
        "category": "Pedicure",
        "price": 40.00,
        "duration_minutes": 45,
        "description": "Standard pedicure",
        "image_url": "https://example.com/classic.jpg",
        "is_active": true
      },
      {
        "id": 6,
        "name": "Paraffin Pedicure",
        "category": "Pedicure",
        "price": 55.00,
        "duration_minutes": 60,
        "description": "Luxury pedicure with paraffin",
        "image_url": "https://example.com/paraffin.jpg",
        "is_active": true
      }
    ]
  },
  "status": "success",
  "timestamp": 1748000000000
}
```

---

### Step 5: Get User Profile Only

```bash
curl -X GET http://localhost:8080/api/v1/dashboard/profile \
  -H "Authorization: Bearer {token}"
```

**Response (200 OK)**:
```json
{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "phone": "+1-555-0101",
  "date_of_birth": "1995-05-15",
  "role": "ROLE_CUSTOMER",
  "created_at": "2026-05-20T18:34:15",
  "updated_at": "2026-05-20T18:34:15"
}
```

---

### Step 6: Get Services by Category

```bash
curl -X GET http://localhost:8080/api/v1/dashboard/services/category/Facial \
  -H "Authorization: Bearer {token}"
```

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "name": "Deep Cleanse Facial",
    "category": "Facial",
    "price": 45.00,
    "duration_minutes": 60,
    "description": "Professional deep cleansing facial",
    "image_url": "https://example.com/deep.jpg",
    "is_active": true
  },
  {
    "id": 2,
    "name": "Hydrating Facial",
    "category": "Facial",
    "price": 55.00,
    "duration_minutes": 60,
    "description": "Intensive hydration treatment",
    "image_url": "https://example.com/hydrate.jpg",
    "is_active": true
  }
]
```

---

### Step 7: Get All Services Grouped by Category

```bash
curl -X GET http://localhost:8080/api/v1/dashboard/services/catalog \
  -H "Authorization: Bearer {token}"
```

**Response (200 OK)**: Same as Step 4's `services_catalog` structure

---

## ERROR SCENARIOS & RESPONSES

### ❌ Missing or Invalid Bearer Token

**Request**:
```bash
curl -X GET http://localhost:8080/api/v1/dashboard/home
```

**Response (403 Forbidden)**:
```json
{
  "status_code": 403,
  "message": "Access denied",
  "details": "JWT token validation failed",
  "request_path": "/api/v1/dashboard/home",
  "timestamp": 1748000000000
}
```

---

### ❌ Expired Token

**Request**:
```bash
curl -X GET http://localhost:8080/api/v1/dashboard/home \
  -H "Authorization: Bearer {expired-token}"
```

**Response (401 Unauthorized)**:
```json
{
  "status_code": 401,
  "message": "Invalid or expired authentication token",
  "details": "JWT token validation failed",
  "request_path": "/api/v1/dashboard/home",
  "timestamp": 1748000000000
}
```

---

### ❌ Invalid Credentials During Login

**Request**:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "nonexistent@example.com",
    "password": "wrongpassword"
  }'
```

**Response (404 Not Found)**:
```json
{
  "status_code": 404,
  "message": "User not found",
  "details": "Resource not found",
  "request_path": "/api/v1/auth/login",
  "timestamp": 1748000000000
}
```

---

### ❌ Insufficient Permissions

**Request** (User without STYLIST role trying to access admin-only endpoint):
```bash
curl -X GET http://localhost:8080/api/v1/dashboard/home \
  -H "Authorization: Bearer {customer-token}"
```

**Response (403 Forbidden)** *(if endpoint restricted to STYLIST role)*:
```json
{
  "status_code": 403,
  "message": "Access denied - insufficient permissions",
  "details": "You do not have permission to access this resource",
  "request_path": "/api/v1/dashboard/home",
  "timestamp": 1748000000000
}
```

---

## POSTMAN COLLECTION

**Import the following into Postman for quick testing:**

```json
{
  "info": {
    "name": "Beauty On Wheel Dashboard API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Register User",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/v1/auth/register",
        "header": [
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "raw": "{\"name\": \"Alice Johnson\", \"email\": \"alice@test.com\", \"phone\": \"+1-555-0101\", \"password\": \"Test@123\", \"role\": \"ROLE_CUSTOMER\"}"
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/v1/auth/login",
        "header": [
          {"key": "Content-Type", "value": "application/json"}
        ],
        "body": {
          "raw": "{\"identifier\": \"alice@test.com\", \"password\": \"Test@123\"}"
        }
      }
    },
    {
      "name": "Dashboard Home",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/v1/dashboard/home",
        "header": [
          {"key": "Authorization", "value": "Bearer {{access_token}}"}
        ]
      }
    },
    {
      "name": "Get Services by Category",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/v1/dashboard/services/category/Facial",
        "header": [
          {"key": "Authorization", "value": "Bearer {{access_token}}"}
        ]
      }
    }
  ]
}
```

---

## DATABASE INSPECTION (H2 Console)

**Access H2 Console**:
```
URL: http://localhost:8080/h2-console
JDBC URL: jdbc:h2:mem:beautyonwheel_local
User: SA
Password: (empty)
```

**Useful Queries**:
```sql
-- View all users
SELECT id, name, email, phone, role FROM users;

-- View all active services
SELECT id, name, category, price, duration_minutes FROM service_items WHERE is_active = true;

-- View services by category
SELECT id, name, category, price FROM service_items WHERE category = 'Facial' AND is_active = true;

-- Count services per category
SELECT category, COUNT(*) as count FROM service_items WHERE is_active = true GROUP BY category;
```

---

## IMPORTANT NOTES

### Bearer Token Format
Always include the "Bearer " prefix before the token:
```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

### CORS Headers
The API allows requests from:
- `http://localhost:4200` (Angular)
- `http://localhost:4300`
- `http://localhost:3000`

### Token Expiration
- **Expiration Time**: 86400 seconds (24 hours)
- **After Expiration**: Re-login to get a new token

### Password Requirements
- Minimum 8 characters
- Must be BCrypt hashed before storing

### Service Catalog Grouping
Services are automatically grouped alphabetically by category:
- Facial
- Hair
- Makeup
- Pedicure

---

## TROUBLESHOOTING

### Issue: 403 Forbidden on Dashboard Endpoint
**Solution**: Ensure you're sending a valid Bearer token in the Authorization header.

### Issue: 401 Unauthorized
**Solution**: Token may be expired. Re-login and get a new token.

### Issue: CORS Error in Browser
**Solution**: Ensure your Angular app is running on one of the allowed origins (localhost:4200, etc.)

### Issue: No Services in Response
**Solution**: Insert test data using H2 Console or the INSERT SQL statements above.

---

## VERSION INFO
- **API Version**: 1.0
- **Spring Boot**: 3.3.0
- **Java**: 21
- **Database**: H2 (Development)
- **Last Updated**: May 20, 2026

---

**Happy Testing! 🎉**
