# API Testing Guide - Registration & Login

## Prerequisites
- Application running on http://localhost:8081
- PostgreSQL connected and database created

---

## Test 1: User Registration

### Request
```bash
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "SecurePass123!",
    "phone": "9876543210"
  }'
```

### Expected Response (Status: 201 Created)
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "dateOfBirth": null,
  "role": "ROLE_CUSTOMER",
  "createdAt": "2026-05-21T10:30:00",
  "updatedAt": "2026-05-21T10:30:00"
}
```

### Verify in Database
```sql
SELECT * FROM users WHERE email = 'john.doe@example.com';
```

---

## Test 2: User Login with Email

### Request
```bash
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

### Expected Response (Status: 200 OK)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImlhdCI6MTcxNjI5NjIwMCwiZXhwIjoxNzE2MzgyNjAwfQ.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "9876543210",
    "role": "ROLE_CUSTOMER"
  }
}
```

### Error Response - Wrong Password (Status: 401 Unauthorized)
```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

---

## Test 3: User Login with Phone

### Request
```bash
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "9876543210",
    "password": "SecurePass123!"
  }'
```

### Expected Response (Status: 200 OK)
Same as Test 2, user can login with either email or phone.

---

## Test 4: Get Service Categories

### Request
```bash
curl -X GET http://localhost:8081/api/v1/home/categories \
  -H "Content-Type: application/json"
```

### Expected Response (Status: 200 OK)
```json
[
  {
    "id": 1,
    "name": "Hair Services",
    "description": "Professional hair cutting and styling"
  },
  {
    "id": 2,
    "name": "Makeup Services",
    "description": "Professional makeup application"
  }
]
```

---

## Test 5: Multiple User Registration

### User 2: Register
```bash
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "password": "SecurePass456!",
    "phone": "9876543211"
  }'
```

### User 3: Register
```bash
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "bob.johnson@example.com",
    "firstName": "Bob",
    "lastName": "Johnson",
    "password": "SecurePass789!",
    "phone": "9876543212"
  }'
```

### Verify All Users in Database
```sql
SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC;
```

---

## Test 6: Error Cases

### Case 1: Duplicate Email
```bash
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Duplicate",
    "password": "AnotherPass123!",
    "phone": "9999999999"
  }'
```
**Response (Status: 409 Conflict)**
```json
{
  "error": "Email already registered",
  "message": "An account with this email already exists"
}
```

### Case 2: Invalid Email Format
```bash
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "firstName": "John",
    "lastName": "Doe",
    "password": "SecurePass123!",
    "phone": "9876543210"
  }'
```
**Response (Status: 400 Bad Request)**
```json
{
  "error": "Validation failed",
  "message": "Email should be valid"
}
```

### Case 3: Missing Required Field
```bash
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "SecurePass123!"
  }'
```
**Response (Status: 400 Bad Request)**
```json
{
  "error": "Validation failed",
  "message": "Phone number is required"
}
```

### Case 4: User Not Found
```bash
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "nonexistent@example.com",
    "password": "SomePassword123!"
  }'
```
**Response (Status: 401 Unauthorized)**
```json
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

---

## Database Verification Commands

### Check PostgreSQL Connection
```bash
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d beautyonwheel_dev -c "SELECT version();"
```

### Count Registered Users
```bash
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d beautyonwheel_dev -c "SELECT COUNT(*) as total_users FROM users;"
```

### View All Registered Users
```bash
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d beautyonwheel_dev -c "SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC;"
```

### View Specific User
```bash
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d beautyonwheel_dev -c "SELECT * FROM users WHERE email = 'john.doe@example.com';"
```

### View All Service Categories
```bash
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d beautyonwheel_dev -c "SELECT * FROM service_category;"
```

---

## PowerShell Testing One-Liner

Save as `quick-test.ps1`:

```powershell
# Quick test of registration and login
$baseUrl = "http://localhost:8081/api/v1"
$email = "test_$(Get-Random -Maximum 10000)@example.com"
$phone = "555-$(Get-Random -Maximum 10000)"

# Register
Write-Host "Registering user: $email" -ForegroundColor Yellow
$reg = Invoke-RestMethod -Method POST -Uri "$baseUrl/auth/register" `
  -Headers @{"Content-Type"="application/json"} `
  -Body (@{
    email=$email; firstName="Test"; lastName="User"; 
    password="Pass123!"; phone=$phone
  } | ConvertTo-Json)

Write-Host "✓ Registered - User ID: $($reg.id)" -ForegroundColor Green

# Login
Write-Host "Logging in as: $email" -ForegroundColor Yellow
$login = Invoke-RestMethod -Method POST -Uri "$baseUrl/auth/login" `
  -Headers @{"Content-Type"="application/json"} `
  -Body (@{
    identifier=$email; password="Pass123!"
  } | ConvertTo-Json)

Write-Host "✓ Logged in - Token: $($login.accessToken.Substring(0,20))..." -ForegroundColor Green
```

Run it:
```powershell
.\quick-test.ps1
```

---

## Important Notes

✅ **Registration Creates User with Password Hash**
- Passwords are hashed using BCrypt
- Original passwords are never stored

✅ **Login Returns JWT Token**
- Token valid for 24 hours (86400 seconds)
- Token can be used in Authorization header for protected endpoints

✅ **Database Verification**
- All registered users appear in `users` table
- Check `password_hash` column contains hashed password

✅ **CORS Enabled**
- Frontend on localhost:4200 is allowed
- Adjust in SecurityConfig if needed

---

**Last Updated**: May 21, 2026
