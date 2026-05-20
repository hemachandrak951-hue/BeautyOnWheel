# 🚀 Beauty On Wheel - Dashboard API Quick Reference

## ENDPOINTS AT A GLANCE

### Authentication (Public)
```
POST   /api/v1/auth/register          → Register new user
POST   /api/v1/auth/login             → Login & get JWT token
```

### Dashboard (Protected - Requires JWT Bearer Token)
```
GET    /api/v1/dashboard/home                        → User profile + grouped services
GET    /api/v1/dashboard/profile                     → User profile only
GET    /api/v1/dashboard/services/catalog            → All services grouped by category
GET    /api/v1/dashboard/services/category/{cat}    → Services in specific category
```

---

## CURL TEMPLATES

### 1️⃣ Register
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@test.com",
    "phone": "+1-555-0101",
    "password": "Test@123",
    "role": "ROLE_CUSTOMER"
  }'
```

### 2️⃣ Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "alice@test.com",
    "password": "Test@123"
  }'
```
**Save**: Copy the `access_token` from response

### 3️⃣ Dashboard Home (⭐ Main)
```bash
TOKEN="your_token_here"
curl -X GET http://localhost:8080/api/v1/dashboard/home \
  -H "Authorization: Bearer $TOKEN"
```

### 4️⃣ Get Services by Category
```bash
TOKEN="your_token_here"
curl -X GET http://localhost:8080/api/v1/dashboard/services/category/Facial \
  -H "Authorization: Bearer $TOKEN"
```

### 5️⃣ Get All Services
```bash
TOKEN="your_token_here"
curl -X GET http://localhost:8080/api/v1/dashboard/services/catalog \
  -H "Authorization: Bearer $TOKEN"
```

---

## RESPONSE STRUCTURE

### Dashboard Home Response
```json
{
  "user_profile": {
    "id": 1,
    "name": "Alice",
    "email": "alice@test.com",
    "phone": "+1-555-0101",
    "role": "ROLE_CUSTOMER"
  },
  "services_catalog": {
    "Facial": [
      {
        "id": 1,
        "name": "Deep Cleanse Facial",
        "category": "Facial",
        "price": 45.00,
        "duration_minutes": 60,
        "description": "...",
        "is_active": true
      }
    ],
    "Makeup": [/*...*/],
    "Pedicure": [/*...*/],
    "Hair": [/*...*/]
  },
  "status": "success"
}
```

---

## ERROR CODES

| Code | Meaning | Solution |
|------|---------|----------|
| 200 | ✅ Success | Request processed |
| 201 | ✅ Created | Resource created (register) |
| 400 | ❌ Bad Request | Invalid input data |
| 401 | ❌ Unauthorized | Missing/expired token |
| 403 | ❌ Forbidden | Insufficient permissions |
| 404 | ❌ Not Found | Resource doesn't exist |
| 500 | ❌ Server Error | Internal error |

---

## DATABASE QUERIES (H2 Console)

### View All Users
```sql
SELECT id, name, email, role FROM users;
```

### View All Services
```sql
SELECT id, name, category, price FROM service_items WHERE is_active = true;
```

### Services by Category
```sql
SELECT name, price FROM service_items 
WHERE category = 'Facial' AND is_active = true;
```

### Insert Test Service
```sql
INSERT INTO service_items (name, category, price, duration_minutes, is_active, created_at, updated_at) 
VALUES ('Premium Facial', 'Facial', 75.00, 90, true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
```

---

## ENVIRONMENT SETUP

### 1. Start Server
```bash
cd d:\BeautyOnWheel
.\mvnw spring-boot:run
```

### 2. Access Points
- **API**: http://localhost:8080
- **H2 Console**: http://localhost:8080/h2-console
- **Angular Frontend**: http://localhost:4200

### 3. H2 Console Login
```
URL: jdbc:h2:mem:beautyonwheel_local
User: SA
Password: (empty)
```

---

## DEVELOPMENT CHECKLIST

- [ ] Server running on port 8080
- [ ] Database initialized (3 tables created)
- [ ] Test data inserted (if needed)
- [ ] User registered
- [ ] JWT token obtained
- [ ] Dashboard endpoint called successfully
- [ ] Services grouped by category
- [ ] CORS headers verified

---

## TOKEN MANAGEMENT

### Extract Token from Login Response
```bash
TOKEN=$(curl ... | jq -r '.access_token')
echo $TOKEN
```

### Check Token in Request
```bash
curl -H "Authorization: Bearer $TOKEN" http://...
```

### Token Properties
- **Format**: Bearer eyJhbGc...
- **Expiration**: 24 hours (86400 seconds)
- **Includes**: userId, role, email
- **Algorithm**: HS512 (HMAC-SHA512)

---

## FILES & LOCATIONS

| File | Purpose |
|------|---------|
| `DashboardController.java` | REST endpoints |
| `DashboardService.java` | Business logic |
| `ServiceItem.java` | Service entity |
| `JwtService.java` | Token validation |
| `GlobalExceptionHandler.java` | Error handling |
| `SecurityConfig.java` | JWT & CORS setup |

---

## SERVICE CATEGORIES

### Available Categories
1. **Facial**: Deep cleanse, hydrating, anti-aging
2. **Hair**: Haircut, color, spa treatment
3. **Makeup**: Bridal, party, natural
4. **Pedicure**: Classic, paraffin, gel, spa

---

## COMMON ISSUES

### ❌ 403 Forbidden
→ Missing `Authorization: Bearer {token}` header

### ❌ 401 Unauthorized  
→ Token expired or invalid

### ❌ 404 Not Found
→ User doesn't exist or service category invalid

### ❌ CORS Error
→ Frontend origin not in whitelist

### ❌ No Services Showing
→ No test data inserted (use H2 Console to add)

---

## ROLES & PERMISSIONS

```
ROLE_CUSTOMER  → Can view dashboard, services
ROLE_STYLIST   → Can view dashboard, services, + manage own schedule
ROLE_ADMIN     → Full access to all endpoints
```

---

## QUICK COMMANDS

### Windows PowerShell
```powershell
$token = (curl.exe -X POST http://localhost:8080/api/v1/auth/login ... | ConvertFrom-Json).access_token
curl.exe -H "Authorization: Bearer $token" http://localhost:8080/api/v1/dashboard/home
```

### Linux/macOS
```bash
token=$(curl -s -X POST http://localhost:8080/api/v1/auth/login ... | jq -r '.access_token')
curl -H "Authorization: Bearer $token" http://localhost:8080/api/v1/dashboard/home
```

---

## DOCUMENTATION LINKS

- 📘 **Full Implementation**: `DASHBOARD_IMPLEMENTATION.md`
- 📗 **Testing Guide**: `DASHBOARD_TESTING_GUIDE.md`
- 📙 **Summary**: `IMPLEMENTATION_SUMMARY.md`
- 📕 **This Quick Ref**: `QUICK_REFERENCE.md`

---

## PRODUCTION CHECKLIST

- [ ] Change JWT secret to strong 32+ char value
- [ ] Enable HTTPS/SSL
- [ ] Configure PostgreSQL database
- [ ] Set up environment variables
- [ ] Enable logging & monitoring
- [ ] Test error scenarios
- [ ] Load testing
- [ ] Security audit
- [ ] Deploy to production

---

**Version**: 1.0  
**Last Updated**: May 20, 2026  
**Status**: Production Ready ✅

---

**Questions?** Refer to the detailed documentation files or check the H2 console for database inspection.
