# Beauty On Wheel - API Testing Report

**Date**: May 20, 2026  
**Database**: H2 (In-Memory)  
**Application Status**: ✅ Running Successfully

## Current Setup
- **Framework**: Spring Boot 3.3.0
- **Java Version**: Java 21
- **Database**: H2 Database (In-Memory)
- **Port**: 8081
- **Profile**: local

---

## API Testing Results

### 1. User Registration API ✅
**Endpoint**: `POST /api/v1/auth/register`  
**Status**: Working

**Test Cases Passed**:
- ✅ Register user with ROLE_CUSTOMER
- ✅ Register user with ROLE_STYLIST  
- ✅ Duplicate email validation (409 Conflict)
- ✅ Password validation (must contain uppercase, lowercase, digit, and special character)
- ✅ Phone number validation (10-15 digits)
- ✅ User data stored in database (ID auto-incrementing)

**Sample Request**:
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "9123456789",
  "password": "SecurePass123$",
  "role": "ROLE_STYLIST"
}
```

**Sample Response**:
```json
{
  "id": 5,
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "phone": "9123456789",
  "role": "ROLE_STYLIST",
  "dateOfBirth": null,
  "createdAt": "2026-05-20T23:58:37.060148",
  "updatedAt": "2026-05-20T23:58:37.060148"
}
```

---

### 2. User Login API ✅
**Endpoint**: `POST /api/v1/auth/login`  
**Status**: Working

**Features**:
- ✅ Login with email (identifier field)
- ✅ JWT token generation
- ✅ User information in response
- ✅ Token expiration: 86400 seconds (24 hours)

**Sample Request**:
```json
{
  "identifier": "jane.smith@example.com",
  "password": "SecurePass123$"
}
```

**Sample Response**:
```json
{
  "user": {
    "id": 5,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "9123456789",
    "role": "ROLE_STYLIST",
    "dateOfBirth": null,
    "createdAt": "2026-05-20T23:58:37.060148",
    "updatedAt": "2026-05-20T23:58:37.060148"
  },
  "access_token": "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoiUk9MRV9TVFlMSVNUIiwidXNlcklkIjoiNSIsImVtYWlsIjoiamFuZS5zbWl0aEBleGFtcGxlLmNvbSIsInN1YiI6ImphbmUuc21pdGhAZXhhbXBsZS5jb20iLCJpYXQiOjE3NzkzMDE3NDksImV4cCI6MTc3OTM4ODE0OX0.BMJbMXUZ5NLZ7UeGpLUJqgtnVp6CQVZUjST1u6QChzuNjA84RLNnuqq0y8POA44uJQ4y2dOWs-FqOFnqiT3sqQ",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

---

### 3. Service Categories API ✅
**Endpoint**: `GET /api/v1/home/categories`  
**Status**: Working

**Features**:
- ✅ Endpoint accessible without authentication
- ✅ Returns empty list when no categories exist
- ✅ Proper JSON response format

**Response**:
```json
[]
```

---

## Database Verification

### Registered Users in H2 Database:
| ID | Name | Email | Phone | Role | Created At |
|----|------|-------|-------|------|------------|
| 5 | Jane Smith | jane.smith@example.com | 9123456789 | ROLE_STYLIST | 2026-05-20T23:58:37 |
| 6 | Alice Johnson | alice@example.com | 8765432123 | ROLE_CUSTOMER | 2026-05-20T23:58:XX |

**Database Status**: ✅ Data persistence verified  
**Tables Created**: 4 tables (users, service_categories, service_items, suggested_products)

---

## Password Validation Rules

Passwords must meet the following criteria:
- ✅ Minimum 8 characters, maximum 128 characters
- ✅ At least one uppercase letter (A-Z)
- ✅ At least one lowercase letter (a-z)
- ✅ At least one digit (0-9)
- ✅ At least one special character from: `@`, `$`, `!`, `%`, `*`, `?`, `&`

**Valid Example**: `SecurePass123$`  
**Invalid Example**: `password123` (no uppercase, no special char)

---

## Application Logs

```
2026-05-20 23:56:09 - Starting BeautyOnWheelApplication v1.0.0
2026-05-20 23:56:09 - The following 1 profile is active: "local"
2026-05-20 23:56:11 - Finished Spring Data repository scanning: Found 4 JPA repository interfaces
2026-05-20 23:56:12 - Tomcat initialized with port 8081 (http)
2026-05-20 23:56:12 - H2 console available at '/h2-console'
2026-05-20 23:56:12 - Hibernate ORM initialized successfully
```

**H2 Console URL**: `http://localhost:8081/h2-console`

---

## PostgreSQL Migration Status

**Current Issue**: PostgreSQL Windows service has authentication issues  
**Resolution**: Temporarily using H2 for testing

### Steps to Migrate to PostgreSQL:

1. **Fix PostgreSQL Installation**:
   ```bash
   # Stop PostgreSQL service
   Stop-Service -Name "postgresql-x64-18" -Force
   
   # Start service
   Start-Service -Name "postgresql-x64-18"
   ```

2. **Create Database** (once PostgreSQL is running):
   ```bash
   createdb -U postgres -h localhost beautyonwheel_local
   ```

3. **Update Configuration**:
   - Edit: `src/main/resources/application-local.properties`
   - Change to PostgreSQL connection string
   - Update Hibernate dialect

4. **Application Properties for PostgreSQL**:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/beautyonwheel_local
   spring.datasource.username=postgres
   spring.datasource.password=postgres
   spring.datasource.driver-class-name=org.postgresql.Driver
   spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
   ```

---

## API Testing Commands

### Register User:
```powershell
$body = @{
    name = "Test User"
    email = "test@example.com"
    phone = "9876543210"
    password = "TestPass123!"
    role = "ROLE_CUSTOMER"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8081/api/v1/auth/register" `
  -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

### Login User:
```powershell
$body = @{
    identifier = "test@example.com"
    password = "TestPass123!"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8081/api/v1/auth/login" `
  -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

### Get Categories:
```powershell
Invoke-WebRequest -Uri "http://localhost:8081/api/v1/home/categories" `
  -Method GET -UseBasicParsing
```

---

## Summary

✅ **All tested APIs are working correctly**  
✅ **User registration and login functioning**  
✅ **Data persistence verified in H2 database**  
✅ **JWT authentication implemented**  
✅ **Input validation working as expected**  

**Next Steps**:
1. Fix PostgreSQL service and migrate database
2. Add more test cases for other endpoints
3. Setup integration tests
4. Deploy to production environment

---

**Tested By**: Automation  
**Last Updated**: 2026-05-20T23:58:40
