# Beauty On Wheel - Customer Dashboard Backend Implementation

## Overview
This document describes the complete, production-ready Customer Dashboard backend subsystem built with Spring Boot 3.x and Spring Security 6, featuring JWT-based stateless authentication and a structured REST API following Amazon/Flipkart-style service catalog patterns.

---

## 1. ARCHITECTURE & TECH STACK

### Technology Stack
- **Java 21** - Latest LTS release with enhanced performance
- **Spring Boot 3.3.0** - Latest microservice framework
- **Spring Security 6** - JWT token-based stateless authentication
- **Spring Data JPA** - ORM layer with Hibernate
- **H2 Database** - In-memory for development (PostgreSQL ready)
- **Lombok** - Boilerplate reduction
- **Jakarta Validation API** - Input constraint handling

### Core Architectural Principles
1. **Layered Architecture**: Entity → Repository → Service → Controller
2. **Security-First Design**: All dashboard endpoints behind JWT token validation
3. **DTO Pattern**: Request/Response objects decouple internal entities from API contracts
4. **Stateless Authentication**: No session management; token-based validation on each request
5. **CORS-Enabled**: Explicit configuration for Angular frontend integration

---

## 2. DATABASE SCHEMA

### Entity Relationship Diagram
```
User (users table)
├── id: Long (PK)
├── name: String (non-nullable)
├── email: String (unique, indexed)
├── phone: String (unique)
├── dateOfBirth: LocalDate
├── passwordHash: String (BCrypt)
├── role: Enum (ROLE_CUSTOMER, ROLE_STYLIST, ROLE_ADMIN)
├── createdAt: LocalDateTime
└── updatedAt: LocalDateTime

ServiceItem (service_items table)
├── id: Long (PK)
├── name: String (indexed)
├── category: String (indexed) [Facial, Makeup, Pedicure, Hair]
├── price: BigDecimal (10,2 precision)
├── durationMinutes: Integer
├── description: Text
├── imageUrl: String
├── isActive: Boolean (indexed)
├── createdAt: LocalDateTime
└── updatedAt: LocalDateTime
```

### Key Constraints
- **service_items**: 
  - Index on `category` for fast filtering by service type
  - Index on `is_active` for quick retrieval of available services
  - Unique constraint implied by combination of (name, category)

---

## 3. COMPONENT BREAKDOWN

### 3.1 Entities

#### User.java (`entity/User.java`)
- JPA entity representing authenticated users
- Roles: CUSTOMER, STYLIST, ADMIN
- Password stored as BCrypt hash (never plain text)
- Temporal audit fields: `createdAt`, `updatedAt`

#### ServiceItem.java (`entity/ServiceItem.java`)
- JPA entity representing salon services
- Examples: "Deep Cleanse Facial", "Bridal Glow Makeup", "Paraffin Pedicure"
- Price stored as `BigDecimal` for financial accuracy
- Active/Inactive status for soft-delete pattern
- Indexed category for quick filtering by type

---

### 3.2 Data Transfer Objects (DTOs)

#### UserDTO (`dto/UserDTO.java`)
```json
{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "phone": "+1-555-0101",
  "date_of_birth": "1995-05-15",
  "role": "ROLE_CUSTOMER",
  "created_at": "2026-05-20T11:30:00",
  "updated_at": "2026-05-20T11:30:00"
}
```
**Purpose**: Safe user profile response (excludes `passwordHash`)

#### ServiceItemDTO (`dto/ServiceItemDTO.java`)
```json
{
  "id": 1,
  "name": "Deep Cleanse Facial",
  "category": "Facial",
  "price": 45.00,
  "duration_minutes": 60,
  "description": "Professional deep cleansing facial for all skin types",
  "image_url": "https://example.com/deep-cleanse.jpg",
  "is_active": true
}
```
**Purpose**: Catalog item response for service listings

#### DashboardResponse (`dto/DashboardResponse.java`)
```json
{
  "user_profile": { /* UserDTO */ },
  "services_catalog": {
    "Facial": [ /* ServiceItemDTOs */ ],
    "Makeup": [ /* ServiceItemDTOs */ ],
    "Pedicure": [ /* ServiceItemDTOs */ ],
    "Hair": [ /* ServiceItemDTOs */ ]
  },
  "status": "success",
  "timestamp": 1748000000000
}
```
**Purpose**: Unified dashboard response combining user context and service catalog

---

### 3.3 Repository Layer

#### UserRepository (`repository/UserRepository.java`)
```java
// Custom query methods
User findByEmail(String email);
User findByPhone(String phone);
Optional<User> findByEmailOrPhone(String email, String phone);
boolean existsByEmail(String email);
boolean existsByPhone(String phone);
```

#### ServiceItemRepository (`repository/ServiceItemRepository.java`)
```java
// Find active services by category
List<ServiceItem> findByCategoryAndIsActiveTrue(String category);

// Get all active services
List<ServiceItem> findByIsActiveTrue();

// Get distinct active categories (for grouping)
List<String> findAllActiveCategories();

// Find service by name
Optional<ServiceItem> findByName(String name);
```

---

### 3.4 Security & JWT

#### JwtService (`security/JwtService.java`)
**Responsibilities**:
- Extract and validate JWT claims from Bearer tokens
- Check token expiration
- Extract user information: username (email), userId, role
- Parse Authorization header

**Key Methods**:
```java
public Claims extractAllClaims(String token)        // Validate & extract all claims
public String extractUsername(String token)         // Get user email
public String extractUserId(String token)           // Get user ID
public String extractRole(String token)             // Get user role
public boolean isTokenValid(String token)           // Check validity & expiration
public String extractTokenFromHeader(String auth)   // Parse "Bearer {token}"
```

#### JwtAuthenticationFilter (`config/JwtAuthenticationFilter.java`)
- Intercepts HTTP requests before they reach controllers
- Extracts Bearer token from `Authorization` header
- Validates token using `JwtService`
- Populates `SecurityContextHolder` with authenticated user details
- Allows request to proceed if valid; rejects if invalid/expired

---

### 3.5 Service Layer

#### DashboardService (`service/DashboardService.java`)
**Responsibilities**:
1. **Dashboard Aggregation**: Combine user profile + service catalog
2. **Service Grouping**: Organize services by category for Amazon/Flipkart-style listing
3. **Authentication Context**: Extract current user from `SecurityContextHolder`

**Key Methods**:
```java
// Main dashboard endpoint
DashboardResponse getDashboard(String userEmail)

// Get services grouped by category (ordered map)
Map<String, List<ServiceItemDTO>> getServicesCatalogByCategory()

// Get services for specific category
List<ServiceItemDTO> getServicesByCategory(String category)

// Validate user authentication
String getCurrentUserEmail()

// Get authenticated user profile
UserDTO getCurrentUserProfile()
```

**Service Catalog Structure**:
```
Facial
├── Deep Cleanse Facial ($45)
├── Hydrating Facial ($55)
├── Anti-Aging Facial ($65)
└── Acne Control Facial ($50)

Hair
├── Professional Haircut ($35)
├── Hair Color ($50)
├── Hair Spa Treatment ($45)
└── Keratin Treatment ($70)

Makeup
├── Bridal Glow Makeup ($80)
├── Party Makeup ($60)
├── Natural Everyday Makeup ($45)
└── Eye Makeup Specialist ($35)

Pedicure
├── Classic Pedicure ($40)
├── Paraffin Pedicure ($55)
├── Gel Pedicure ($60)
└── Spa Pedicure Deluxe ($75)
```

---

### 3.6 Controller Layer

#### DashboardController (`controller/DashboardController.java`)
**Base Path**: `/api/v1/dashboard`

##### Endpoints

**1. GET /api/v1/dashboard/home** (Main Endpoint)
- **Security**: Requires valid JWT Bearer token
- **Roles**: CUSTOMER, STYLIST, ADMIN
- **Response**: 200 OK
```bash
curl -X GET http://localhost:8080/api/v1/dashboard/home \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
```
**Response Body**:
```json
{
  "user_profile": { /* UserDTO */ },
  "services_catalog": { /* Grouped services */ },
  "status": "success",
  "timestamp": 1748000000000
}
```

**2. GET /api/v1/dashboard/profile**
- **Security**: Requires valid JWT token
- **Purpose**: Get authenticated user's profile only
- **Response**: 200 OK with UserDTO

**3. GET /api/v1/dashboard/services/catalog**
- **Security**: Requires valid JWT token
- **Purpose**: Get all services grouped by category
- **Response**: 200 OK with Map<String, List<ServiceItemDTO>>

**4. GET /api/v1/dashboard/services/category/{category}**
- **Security**: Requires valid JWT token
- **Purpose**: Get services for specific category
- **Path Parameter**: `category` (e.g., "Facial", "Makeup")
- **Response**: 200 OK with List<ServiceItemDTO>

---

## 4. ERROR HANDLING & SECURITY

### GlobalExceptionHandler Enhancements
```java
// 401 Unauthorized - Invalid or expired JWT
@ExceptionHandler(JwtException.class)
→ Returns: { status: 401, message: "Invalid or expired authentication token" }

// 403 Forbidden - Insufficient permissions
@ExceptionHandler(AccessDeniedException.class)
→ Returns: { status: 403, message: "Access denied - insufficient permissions" }

// 401 Unauthorized - User not authenticated
@ExceptionHandler(IllegalStateException.class)
→ Returns: { status: 401, message: "Authentication required" }

// 404 Not Found
@ExceptionHandler(ResourceNotFoundException.class)
→ Returns: { status: 404, message: "User not found" }

// 400 Bad Request
@ExceptionHandler(IllegalArgumentException.class)
→ Returns: { status: 400, message: "Invalid credentials" }
```

---

## 5. CORS CONFIGURATION

### Cross-Origin Resource Sharing (CORS)
Configured in `SecurityConfig.java`:

```java
Allowed Origins:
- http://localhost:4200 (Angular dev server)
- http://localhost:4300 (Alternate)
- http://localhost:3000 (Node alternatives)

Allowed Methods:
- GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD

Allowed Headers:
- Authorization (Bearer token)
- Content-Type
- Accept
- X-Requested-With
- Cache-Control

Exposed Headers:
- Authorization
- Content-Type

Max Age: 3600 seconds (1 hour)
Credentials: Allowed (true)
```

---

## 6. SECURITY FLOW - AUTHENTICATION & AUTHORIZATION

### Request Flow
```
1. Client → POST /api/v1/auth/login
   ├─ Credentials: { identifier, password }
   └─ Response: { access_token, token_type: "Bearer", expires_in, user }

2. Client → GET /api/v1/dashboard/home
   ├─ Header: Authorization: Bearer {access_token}
   └─ JwtAuthenticationFilter intercepts request
      ├─ Extracts token from "Bearer " prefix
      ├─ Validates token using JwtService
      ├─ Verifies expiration
      ├─ Populates SecurityContextHolder
      └─ Request proceeds to controller

3. DashboardController → getDashboard()
   ├─ SecurityContextHolder.getContext().getAuthentication()
   ├─ Extract user email from principal
   ├─ Query user & services from DB
   └─ Response: DashboardResponse (user profile + catalog)
```

### Token Claims Structure
```json
{
  "userId": "1",
  "role": "ROLE_CUSTOMER",
  "email": "alice.johnson@example.com",
  "iat": 1748000000,
  "exp": 1748086400,
  "sub": "alice.johnson@example.com"
}
```

---

## 7. TESTING THE IMPLEMENTATION

### 7.1 Register User
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

### 7.2 Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "alice.johnson@example.com",
    "password": "Test@123"
  }'
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhbGljZS5qb2huc29uQGV4YW1wbGUuY29tIiwianNvbndlYnRva2VuLmNsYWltcy5qdGkiOiIxIn0.signature",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": { /* UserProfileResponse */ }
}
```

### 7.3 Access Dashboard (with Bearer Token)
```bash
curl -X GET http://localhost:8080/api/v1/dashboard/home \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
```

### 7.4 Get Services by Category
```bash
curl -X GET http://localhost:8080/api/v1/dashboard/services/category/Facial \
  -H "Authorization: Bearer {token}"
```

---

## 8. DEPLOYMENT & PRODUCTION CONSIDERATIONS

### Configuration for Production
**application-prod.properties**:
```properties
# Security
app.jwt.secret=<generate-strong-32-char-secret>
app.jwt.expiration=3600000

# Database (PostgreSQL)
spring.datasource.url=jdbc:postgresql://prod-db-host:5432/beautyonwheel
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# Security
server.ssl.enabled=true
server.ssl.key-store=${SSL_KEYSTORE_PATH}
server.ssl.key-store-password=${SSL_PASSWORD}
```

### Database Migrations
For production deployments, use **Liquibase** or **Flyway** for version-controlled schema evolution.

### API Rate Limiting
Implement `spring-cloud-gateway` with rate limiters to protect dashboard endpoints from abuse:
```yaml
- id: dashboard_ratelimit
  uri: http://localhost:8080
  predicates:
    - Path=/api/v1/dashboard/**
  filters:
    - name: RequestRateLimiter
      args:
        redis-rate-limiter.replenish-rate: 100
        redis-rate-limiter.burst-capacity: 200
```

---

## 9. TESTING STRATEGY

### Unit Tests
- **JwtService**: Token extraction, validation, expiration checks
- **DashboardService**: Service grouping, user context validation
- **Repositories**: Custom query derivations

### Integration Tests
- **DashboardController**: JWT authentication flow, CORS headers
- **SecurityConfig**: Token validation in request pipeline
- **Database**: Schema and initialization data verification

### Postman Collection
Import the provided `dashboard-api.postman_collection.json` for rapid endpoint testing.

---

## 10. FILE STRUCTURE

```
src/main/java/com/beautyonwheel/
├── entity/
│   ├── User.java (existing)
│   └── ServiceItem.java (new)
├── dto/
│   ├── UserProfileResponse.java (existing)
│   ├── UserDTO.java (new)
│   ├── ServiceItemDTO.java (new)
│   └── DashboardResponse.java (new)
├── repository/
│   ├── UserRepository.java (existing)
│   └── ServiceItemRepository.java (new)
├── service/
│   ├── AuthService.java (existing)
│   └── DashboardService.java (new)
├── security/
│   ├── JwtTokenProvider.java (existing)
│   ├── JwtService.java (new)
│   └── JwtAuthenticationFilter.java (existing)
├── controller/
│   ├── AuthController.java (existing)
│   └── DashboardController.java (new)
├── config/
│   └── SecurityConfig.java (enhanced)
└── exception/
    └── GlobalExceptionHandler.java (enhanced)

src/main/resources/
├── application.properties
├── application-dev.properties
├── application-prod.properties
└── schema-h2.sql (test data)
```

---

## 11. SUMMARY OF FEATURES

✅ **JWT-Based Authentication**: Stateless token validation on every request  
✅ **Role-Based Access Control**: Customer, Stylist, Admin roles with granular permissions  
✅ **Service Catalog Grouping**: Amazon/Flipkart-style category-based service listings  
✅ **CORS Enabled**: Seamless Angular frontend integration  
✅ **Global Exception Handling**: Structured error responses (401, 403, 404, etc.)  
✅ **Database Indexing**: Optimized queries for category filtering and active status  
✅ **Scalable Design**: Ready for PostgreSQL migration and microservice deployment  
✅ **Production-Ready**: Security best practices, transaction management, audit trails  

---

## 12. REFERENCES & RESOURCES

- [Spring Security 6 Documentation](https://spring.io/projects/spring-security)
- [JJWT Library](https://github.com/jwtk/jjwt)
- [Spring Data JPA Guide](https://spring.io/projects/spring-data-jpa)
- [Jakarta Bean Validation](https://jakarta.ee/specifications/bean-validation/)

---

**Last Updated**: May 20, 2026  
**Version**: 1.0  
**Status**: Production Ready
