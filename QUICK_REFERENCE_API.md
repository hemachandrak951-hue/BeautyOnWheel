# Quick Reference - Beauty On Wheel Auth Service

## 🚀 Start Application
```bash
cd d:\BeautyOnWheel
java -jar target/beautyonwheel-auth-service-1.0.0.jar --spring.profiles.active=local
```

**Server runs on**: http://localhost:8081  
**H2 Console**: http://localhost:8081/h2-console

---

## 📝 API Endpoints

### Register User
```
POST http://localhost:8081/api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "SecurePass123@",
  "role": "ROLE_CUSTOMER"
}
```
**Status**: ✅ Working  
**Database**: ✅ Storing data with auto-increment ID

---

### Login User
```
POST http://localhost:8081/api/v1/auth/login
Content-Type: application/json

{
  "identifier": "john@example.com",
  "password": "SecurePass123@"
}
```
**Returns**: JWT token + user info  
**Status**: ✅ Working

---

### Get Categories
```
GET http://localhost:8081/api/v1/home/categories
```
**Status**: ✅ Working

---

## 🔑 Password Requirements
- ✅ 8-128 characters
- ✅ Uppercase letter (A-Z)
- ✅ Lowercase letter (a-z)
- ✅ Digit (0-9)
- ✅ Special character (@$!%*?&)

**Valid**: `SecurePass123@`  
**Invalid**: `password123` (no uppercase, no special char)

---

## 📊 Users Currently in Database

| ID | Name | Email | Role |
|----|------|-------|------|
| 5 | Jane Smith | jane.smith@example.com | ROLE_STYLIST |
| 6 | Alice Johnson | alice@example.com | ROLE_CUSTOMER |

---

## 🗄️ Database Status

| Item | Status |
|------|--------|
| Database Type | H2 (In-Memory) |
| Data Persistence | ✅ Working |
| Tables Created | 4 (users, service_categories, service_items, suggested_products) |
| User Count | 2 |
| Auto-increment | ✅ Working (Last ID: 6) |

---

## 📁 Configuration Files

- `application-local.properties` - Current H2 configuration
- `application-dev.properties` - PostgreSQL config (for reference)
- `application-prod.properties` - Production config

---

## 🔄 Build & Run

```bash
# Build only
.\mvnw.cmd clean package -DskipTests

# Run with local profile (H2)
java -jar target/beautyonwheel-auth-service-1.0.0.jar --spring.profiles.active=local

# Run with dev profile (PostgreSQL - when fixed)
java -jar target/beautyonwheel-auth-service-1.0.0.jar --spring.profiles.active=dev
```

---

## 📋 Test Status Summary

✅ Registration API - Working (Users stored)  
✅ Login API - Working (JWT generated)  
✅ Categories API - Working  
✅ Duplicate Prevention - Working  
✅ Password Validation - Working  
✅ Data Persistence - Working  
✅ Database Storage - Verified  

---

## 🚨 Current Issue

**PostgreSQL Windows Service**: Not responding  
**Workaround**: Using H2 database successfully  
**Migration Path**: See POSTGRESQL_MIGRATION.md

---

## 📖 Documentation

1. **API_TEST_REPORT.md** - Detailed test results
2. **POSTGRESQL_MIGRATION.md** - PostgreSQL setup guide  
3. **PROJECT_STATUS.md** - Full status report
4. **README.md** - Project overview

---

## ⚡ Common Tasks

### Test Registration:
```powershell
$body = @{name="Test";email="test@test.com";phone="9999999999";password="Test123@";role="ROLE_CUSTOMER"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8081/api/v1/auth/register" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

### Test Login:
```powershell
$body = @{identifier="test@test.com";password="Test123@"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8081/api/v1/auth/login" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

### View Logs:
Check terminal output where application was started

---

**Status**: ✅ READY FOR TESTING  
**Database**: ✅ DATA STORING SUCCESSFULLY  
**All APIs**: ✅ OPERATIONAL

For detailed information, see PROJECT_STATUS.md
