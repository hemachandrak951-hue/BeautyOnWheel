# PostgreSQL Migration Guide

## Current Status
- **Database**: H2 (In-Memory)
- **Issue**: PostgreSQL Windows service has port binding issues
- **Workaround**: Using H2 for immediate testing

---

## Step 1: Fix PostgreSQL Service

### Option A: Restart PostgreSQL Service
```powershell
# Open PowerShell as Administrator

# Stop the service
Stop-Service -Name "postgresql-x64-18" -Force

# Wait 5 seconds
Start-Sleep -Seconds 5

# Start the service
Start-Service -Name "postgresql-x64-18"

# Verify status
Get-Service -Name "postgresql-x64-18"
```

### Option B: Manual PostgreSQL Start
```bash
# Navigate to PostgreSQL bin directory
cd "C:\Program Files\PostgreSQL\18\bin"

# Start PostgreSQL
.\pg_ctl.exe start -D "C:\Program Files\PostgreSQL\18\data"
```

### Option C: Reinstall PostgreSQL
If the above doesn't work:
1. Uninstall PostgreSQL from Control Panel
2. Restart computer
3. Reinstall PostgreSQL 18.x
4. When prompted, set password as "postgres"

---

## Step 2: Verify PostgreSQL Connection

```bash
# Test connection (password will be prompted)
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "SELECT version();"

# Expected output:
# PostgreSQL 18.x on ...
```

---

## Step 3: Create Database

```bash
# Create the database
"C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres -h localhost beautyonwheel_local
```

Or using psql:
```bash
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE beautyonwheel_local;"
```

---

## Step 4: Update Application Configuration

### Edit: `src/main/resources/application-local.properties`

Replace H2 configuration with PostgreSQL:

```properties
# Local Profile Configuration using PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/beautyonwheel_local
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration for Local Development
spring.jpa.hibernate.ddl-auto=create
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Connection Pool Configuration
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.max-lifetime=1200000

# Logging
logging.level.root=INFO
logging.level.com.beautyonwheel=DEBUG
logging.level.org.springframework.security=INFO
```

---

## Step 5: Build and Run Application

```bash
# Navigate to project directory
cd d:\BeautyOnWheel

# Clean and build
.\mvnw.cmd clean package -DskipTests

# Run with local profile (PostgreSQL)
java -jar target/beautyonwheel-auth-service-1.0.0.jar --spring.profiles.active=local
```

---

## Step 6: Verify Connection

The application should start with PostgreSQL logs like:

```
HikariPool-1 - Added connection conn0: url=jdbc:postgresql://localhost:5432/beautyonwheel_local user=postgres
Hibernate ORM initialized successfully
All tables created by Hibernate
```

---

## Step 7: Test APIs

Register a user:
```powershell
$body = @{
    name = "Test User"
    email = "test.user@example.com"
    phone = "9876543210"
    password = "TestPass123@"
    role = "ROLE_CUSTOMER"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8081/api/v1/auth/register" `
  -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

---

## Troubleshooting

### Issue: Connection refused
**Solution**: Verify PostgreSQL is running
```powershell
Get-Service -Name "postgresql-x64-18" | Select-Object Status
```

### Issue: Authentication failed
**Solution**: Reset PostgreSQL password
```bash
# Using psql
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost

# Then in psql:
ALTER USER postgres WITH PASSWORD 'postgres';
```

### Issue: Port 5432 already in use
**Solution**: Find and kill process
```powershell
# Find process using port 5432
netstat -ano | findstr :5432

# Kill process (replace PID)
Stop-Process -Id <PID> -Force
```

### Issue: Tables not created
**Solution**: Check Hibernate configuration
```bash
# Ensure ddl-auto is set to 'create' or 'update'
# Check application logs for SQL errors
```

---

## Environment Variables (Optional)

For production, use environment variables instead of hardcoding:

```powershell
# Set environment variables
$env:DB_URL = "jdbc:postgresql://localhost:5432/beautyonwheel_local"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "postgres"

# Run application
java -jar target/beautyonwheel-auth-service-1.0.0.jar --spring.profiles.active=local
```

Update `application-local.properties`:
```properties
spring.datasource.url=${DB_URL:jdbc:postgresql://localhost:5432/beautyonwheel_local}
spring.datasource.username=${DB_USERNAME:postgres}
spring.datasource.password=${DB_PASSWORD:postgres}
```

---

## Database Backup (After Migration)

```bash
# Backup database
"C:\Program Files\PostgreSQL\18\bin\pg_dump.exe" -U postgres beautyonwheel_local > backup.sql

# Restore database
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres beautyonwheel_local < backup.sql
```

---

## Rollback to H2

If you need to go back to H2:

1. Edit `src/main/resources/application-local.properties`
2. Restore the H2 configuration
3. Rebuild: `.\mvnw.cmd clean package`
4. Run: `java -jar target/beautyonwheel-auth-service-1.0.0.jar --spring.profiles.active=local`

---

## Production PostgreSQL Configuration

For production, update `src/main/resources/application-prod.properties`:

```properties
# Production PostgreSQL
spring.datasource.url=jdbc:postgresql://${DB_HOST:production-db.example.com}:5432/beautyonwheel_prod
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# Security
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Connection Pool
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000

# SSL
spring.datasource.hikari.data-source-properties.sslmode=require
```

---

**Last Updated**: 2026-05-20  
**PostgreSQL Version**: 18.x  
**Tested On**: Windows 11
