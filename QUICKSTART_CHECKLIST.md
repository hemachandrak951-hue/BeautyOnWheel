# PostgreSQL Migration - Quick Start Checklist

## ✅ COMPLETED: Configuration & Setup

- [x] Updated `application.properties` - Default profile changed to `dev`
- [x] Updated `application-dev.properties` - PostgreSQL configuration
- [x] Updated `application-local.properties` - H2 → PostgreSQL migration
- [x] Verified `pom.xml` - PostgreSQL driver present
- [x] Created comprehensive documentation files
- [x] Created testing scripts and guides

---

## 📋 TODO: Implementation Steps (Do These Now)

### Step 1: Start PostgreSQL Service
- [ ] Open Windows Services (Win + R → services.msc)
- [ ] Find "postgresql-x64-18"
- [ ] Right-click → Start
- [ ] Verify status shows "Running"

**OR use Command Prompt (Admin):**
```batch
net start postgresql-x64-18
```

### Step 2: Create Databases
- [ ] Open Command Prompt
- [ ] Run:
```batch
cd "C:\Program Files\PostgreSQL\18\bin"
createdb -U postgres beautyonwheel_dev
createdb -U postgres beautyonwheel_local
```
(When prompted for password, enter: `C#@ndu951`)

### Step 3: Build Application
- [ ] Open Command Prompt/PowerShell
- [ ] Navigate to project:
```bash
cd d:\BeautyOnWheel
```
- [ ] Clean build:
```bash
mvn clean install
```

### Step 4: Run Application with PostgreSQL
- [ ] Start application:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```
- [ ] Wait for startup message:
```
[INFO] Started BeautyOnWheelApplication in X.XXX seconds
```

### Step 5: Test Registration
- [ ] Open PowerShell in project directory
- [ ] Run test script:
```powershell
.\TEST_POSTGRESQL.ps1
```
- [ ] Or use manual curl test from `API_TESTING_GUIDE.md`

### Step 6: Verify in PostgreSQL
- [ ] Open Command Prompt
- [ ] Connect to database:
```batch
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d beautyonwheel_dev
```
- [ ] Run verification query:
```sql
SELECT id, name, email, phone, role, created_at FROM users;
```
- [ ] Confirm registered users appear in results

### Step 7: Test Login Functionality
- [ ] Use curl command from `API_TESTING_GUIDE.md`
- [ ] Or run PowerShell script again
- [ ] Verify JWT token is returned
- [ ] Confirm token structure: Bearer token format

---

## 📁 Documentation Files (Reference)

| File | Purpose |
|------|---------|
| **MIGRATION_SUMMARY.md** | Complete migration overview |
| **SETUP_POSTGRESQL.md** | Detailed setup instructions |
| **DATABASE_VERIFICATION.md** | SQL queries & verification |
| **API_TESTING_GUIDE.md** | API endpoint testing with examples |
| **TEST_POSTGRESQL.ps1** | Automated PowerShell test script |
| **TEST_POSTGRESQL.sh** | Automated Bash test script |

---

## 🔍 Key Configuration Changes

| Setting | Before | After |
|---------|--------|-------|
| Default Profile | `local` (H2) | `dev` (PostgreSQL) |
| Dev Database | N/A | `beautyonwheel_dev` |
| Local Database | H2 in-memory | `beautyonwheel_local` |
| Connection URL | `jdbc:h2:mem:...` | `jdbc:postgresql://localhost:5432/...` |
| Dialect | H2Dialect | PostgreSQLDialect |
| H2 Console | Enabled | Removed |

---

## ✨ Verification Checklist

After completing all TODO steps, verify:

- [ ] PostgreSQL service is running (`Get-Service postgresql-x64-18`)
- [ ] Can connect to PostgreSQL (`psql -U postgres -l`)
- [ ] Databases exist: `beautyonwheel_dev`, `beautyonwheel_local`
- [ ] Application starts successfully
- [ ] Logs show PostgreSQL dialect
- [ ] User registration works (returns 201)
- [ ] User data appears in database `users` table
- [ ] User login works (returns JWT token)
- [ ] Service categories load successfully
- [ ] Password is hashed in database (not plain text)

---

## 🚨 Troubleshooting

### PostgreSQL Won't Start
```powershell
# Check service status
Get-Service -Name "postgresql-x64-18"

# If stopped, start it
Start-Service -Name "postgresql-x64-18"

# If error about admin rights needed, use:
# - services.msc GUI (run as admin)
# - OR Command Prompt (Admin): net start postgresql-x64-18
```

### "Could not connect to database"
```bash
# Verify PostgreSQL is running
netstat -ano | findstr :5432

# If port not listening, restart service
net stop postgresql-x64-18
net start postgresql-x64-18
```

### "Database does not exist"
```bash
# List existing databases
"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -l

# Create missing database
"C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres beautyonwheel_dev
```

### Application Still Using H2
- Verify logs show: `Using Hibernate dialect: org.hibernate.dialect.PostgreSQLDialect`
- Check `application.properties` has `spring.profiles.default=dev`
- Check active profile in startup logs: `The following profiles are active: dev`

### Login Returns "User Not Found"
- Verify registration was successful
- Check user exists in database: `SELECT * FROM users;`
- Ensure email/phone exactly matches registration
- Passwords are case-sensitive

---

## 📊 Expected Test Results

### Registration Success
```json
Status: 201 Created
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "role": "ROLE_CUSTOMER"
}
```

### Login Success
```json
Status: 200 OK
{
  "accessToken": "eyJhbGc...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": { ... }
}
```

### Database Query Success
```
 id |   name    |      email       |    phone    |      role       |         created_at
----+-----------+------------------+-------------+-----------------+----------------------------
  1 | John Doe  | john@example.com | 9876543210  | ROLE_CUSTOMER   | 2026-05-21 10:30:00
```

---

## 🎯 Next Steps After Verification

1. **Test All Endpoints** - Use `API_TESTING_GUIDE.md`
2. **Test Error Cases** - Wrong password, duplicate email, etc.
3. **Load Testing** - Register multiple users and verify performance
4. **Frontend Integration** - Test Angular frontend against API
5. **Production Deployment** - Use `application-prod.properties` with env vars

---

## ⏱️ Estimated Time

| Step | Time |
|------|------|
| Start PostgreSQL | 1-2 min |
| Create Databases | 1 min |
| Build Application | 2-3 min |
| Run Application | 1 min |
| Test Functionality | 2-3 min |
| **Total** | **7-10 min** |

---

## 📞 Support Resources

- **PostgreSQL Docs**: https://www.postgresql.org/docs/18/
- **Spring Boot PostgreSQL**: https://spring.io/guides/gs/accessing-data-postgresql/
- **JJWT Token Docs**: https://github.com/jwtk/jjwt
- **Spring Security**: https://spring.io/projects/spring-security

---

**Status**: Ready to Execute
**Date**: May 21, 2026
**Last Updated**: May 21, 2026
