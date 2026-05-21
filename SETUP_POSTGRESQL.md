# PostgreSQL Migration - Setup Guide

## Current Status
✅ Configuration files updated to use PostgreSQL
✅ PostgreSQL 18 is installed on your system
⏳ PostgreSQL service needs to be started

## Step 1: Start PostgreSQL Service (REQUIRED)

### Method 1: Using Services GUI (Recommended)
1. Press `Win + R` and type `services.msc`
2. Find **postgresql-x64-18** in the list
3. Right-click and select **Start**
4. Wait for status to show "Running"

### Method 2: Using Command Prompt (Admin)
```batch
REM Open Command Prompt as Administrator (Win + X → Command Prompt Admin)
net start postgresql-x64-18
```

### Method 3: Using PowerShell (Admin)
```powershell
Start-Service -Name "postgresql-x64-18"
Start-Sleep -Seconds 3
Get-Service -Name "postgresql-x64-18"
```

## Step 2: Create Databases

Open Command Prompt and run:

```batch
cd "C:\Program Files\PostgreSQL\18\bin"

REM Create development database
createdb -U postgres beautyonwheel_dev

REM Create local database
createdb -U postgres beautyonwheel_local

REM Verify (optional)
psql -U postgres -l
```

**Note**: When prompted for password, enter: `C#@ndu951`

## Step 3: Build and Run Application

```bash
cd d:\BeautyOnWheel

# Clean build with PostgreSQL profile
mvn clean install

# Run with dev profile (PostgreSQL)
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

## Step 4: Verify Configuration

Once the application is running, you should see:
```
[INFO] Started BeautyOnWheelApplication in X.XXX seconds
[INFO] Using Hibernate dialect: org.hibernate.dialect.PostgreSQLDialect
```

Access the application:
- **Application URL**: http://localhost:8081
- **API Base**: http://localhost:8081/api/v1

## Step 5: Test API Endpoints

### Register New User
```bash
curl -X POST http://localhost:8081/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "SecurePass123!",
    "phone": "1234567890"
  }'
```

### Login
```bash
curl -X POST http://localhost:8081/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

## Troubleshooting

### Port 5432 Already in Use
```bash
netstat -ano | findstr :5432
taskkill /PID <PID> /F
```

### Connection Refused
- ✓ Verify PostgreSQL service is running: `Get-Service -Name "postgresql-x64-18"`
- ✓ Verify databases exist: `"C:\Program Files\PostgreSQL\18\bin\psql" -U postgres -l`

### H2 Database Still Being Used
- Check that `spring.profiles.default=dev` in application.properties
- Remove H2 dependency from pom.xml if you want to completely remove it

## Configuration Files Updated

### ✅ application.properties
- Default profile changed to `dev` (PostgreSQL)

### ✅ application-dev.properties  
- Uses PostgreSQL: `beautyonwheel_dev`
- DDL: `create-drop` (fresh schema on startup)

### ✅ application-local.properties
- Uses PostgreSQL: `beautyonwheel_local`
- DDL: `create` (persistent schema)

### ✅ application-prod.properties
- Uses environment variables for PostgreSQL connection
- Ready for production deployment

## Next Steps

1. **Start PostgreSQL** (Step 1 above)
2. **Create Databases** (Step 2 above)
3. **Build and Test** (Step 3 above)
4. **Run API Tests** (Step 5 above)

---

**Last Updated**: May 21, 2026
