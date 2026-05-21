# PostgreSQL Database Verification Guide

## Quick Verification Steps

### Step 1: Connect to PostgreSQL Database

Open Command Prompt and run:

```batch
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d beautyonwheel_dev
```

You will be prompted for password. Enter: `C#@ndu951`

### Step 2: Verify Tables Exist

Once connected to psql, run these commands:

```sql
-- List all tables
\dt

-- Expected output:
-- Schema |     Name      | Type  | Owner
-- --------+---------------+-------+----------
--  public | service_item  | table | postgres
--  public | service_category | table | postgres
--  public | users         | table | postgres
```

### Step 3: Check User Records

```sql
-- View all users
SELECT * FROM users;

-- View specific user by email
SELECT * FROM users WHERE email = 'test@example.com';

-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- View user details
SELECT 
    id, 
    name, 
    email, 
    phone, 
    role, 
    created_at, 
    updated_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 10;
```

### Step 4: Check Service Categories

```sql
-- View all service categories
SELECT * FROM service_category;

-- Count categories
SELECT COUNT(*) as total_categories FROM service_category;
```

### Step 5: Verify Indexes and Constraints

```sql
-- View unique constraints on users table
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'users';

-- Expected unique constraints:
-- - users_email_key (unique email)
-- - users_phone_key (unique phone)
-- - users_pkey (primary key)
```

### Step 6: Check Connection Details

```sql
-- View current database
SELECT current_database();

-- View current user
SELECT current_user;

-- View server version
SELECT version();
```

---

## Automated Database Verification Script

### PowerShell Script: `VERIFY_POSTGRESQL.ps1`

```powershell
# PostgreSQL Verification Script

$psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
$pgUser = "postgres"
$pgDatabase = "beautyonwheel_dev"

# Function to run SQL query
function Run-SqlQuery {
    param(
        [string]$Query
    )
    
    $result = & $psqlPath -U $pgUser -d $pgDatabase -c $Query 2>$null
    return $result
}

Write-Host "PostgreSQL Database Verification" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if database exists
Write-Host "1. Checking database connection..." -ForegroundColor Yellow
$version = Run-SqlQuery "SELECT version();"
if ($version -like "*PostgreSQL*") {
    Write-Host "✓ Connected to PostgreSQL" -ForegroundColor Green
    Write-Host "   $($version.Split("|")[0].Trim())"
}
else {
    Write-Host "✗ Connection failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# List tables
Write-Host "2. Checking database tables..." -ForegroundColor Yellow
$tables = Run-SqlQuery "\dt"
Write-Host $tables
Write-Host ""

# Count users
Write-Host "3. Checking user records..." -ForegroundColor Yellow
$userCount = Run-SqlQuery "SELECT COUNT(*) FROM users;"
Write-Host "✓ Total users in database: $userCount" -ForegroundColor Green
Write-Host ""

# View recent users
Write-Host "4. Viewing recent registrations..." -ForegroundColor Yellow
$recentUsers = Run-SqlQuery "SELECT id, name, email, phone, role, created_at FROM users ORDER BY created_at DESC LIMIT 5;"
Write-Host $recentUsers
Write-Host ""

# Check service categories
Write-Host "5. Checking service categories..." -ForegroundColor Yellow
$categoryCount = Run-SqlQuery "SELECT COUNT(*) FROM service_category;"
Write-Host "✓ Total service categories: $categoryCount" -ForegroundColor Green
Write-Host ""

Write-Host "Verification Complete!" -ForegroundColor Green
```

---

## Common SQL Queries for Debugging

### Find User by Email

```sql
SELECT * FROM users WHERE email = 'user@example.com';
```

### Get User Authentication Info

```sql
SELECT id, email, password_hash, role FROM users WHERE email = 'user@example.com';
```

### Check Users by Role

```sql
SELECT COUNT(*) as count, role FROM users GROUP BY role;
```

### Get All Users with Full Details

```sql
SELECT 
    id, 
    name, 
    email, 
    phone, 
    date_of_birth, 
    role, 
    created_at, 
    updated_at
FROM users
ORDER BY created_at DESC;
```

### Check Database Size

```sql
SELECT 
    datname as database, 
    pg_size_pretty(pg_database_size(datname)) as size
FROM pg_database
WHERE datname = 'beautyonwheel_dev';
```

### View Table Sizes

```sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Export User Data to CSV

```sql
COPY users TO '/tmp/users.csv' WITH CSV HEADER;
```

### Find Duplicate Emails

```sql
SELECT email, COUNT(*) as count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

---

## Troubleshooting Database Issues

### Issue: "psql: error: could not translate host name "localhost" to address"

**Solution**: Verify PostgreSQL service is running:
```batch
Get-Service -Name "postgresql-x64-18"
```

### Issue: "password authentication failed"

**Solution**: Verify password in application properties:
```properties
spring.datasource.password=C#@ndu951
```

### Issue: "database beautyonwheel_dev does not exist"

**Solution**: Create the database:
```batch
"C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres beautyonwheel_dev
```

### Issue: "relation users does not exist"

**Solution**: 
- Verify `spring.jpa.hibernate.ddl-auto=create` or `create-drop` in properties
- Rebuild and restart the application
- Check application logs for Hibernate errors

### Issue: "ERROR: permission denied for schema public"

**Solution**: Grant permissions to postgres user:
```sql
ALTER SCHEMA public OWNER TO postgres;
GRANT ALL ON SCHEMA public TO postgres;
```

---

## Connection String Reference

### Dev Environment
```
URL: jdbc:postgresql://localhost:5432/beautyonwheel_dev
User: postgres
Password: C#@ndu951
Database: beautyonwheel_dev
```

### Local Environment
```
URL: jdbc:postgresql://localhost:5432/beautyonwheel_local
User: postgres
Password: C#@ndu951
Database: beautyonwheel_local
```

### Production Environment
```
URL: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
User: ${DB_USERNAME}
Password: ${DB_PASSWORD}
Database: beautyonwheel_prod
```

---

**Last Updated**: May 21, 2026
