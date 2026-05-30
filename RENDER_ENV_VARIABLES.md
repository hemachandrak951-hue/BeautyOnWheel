# Render Environment Variables - Quick Reference

## Copy/Paste Template for Render Dashboard

When setting up environment variables in Render:

### Development Profile (Local)
```
SPRING_PROFILES_ACTIVE=dev
```

### Production Profile (Render)
```
SPRING_PROFILES_ACTIVE=prod
PORT=8080
```

## Database Variables (Auto-populated by Render)
```
DB_HOST=<auto-populated>
DB_PORT=5432
DB_NAME=beautyonwheel_prod
DB_USERNAME=postgres
DB_PASSWORD=<auto-populated>
```

## Manual Variables (You must set these)

### JWT_SECRET - Generate using one of:
```bash
# Option 1: OpenSSL (if installed)
openssl rand -base64 32

# Option 2: UUID Generator (4 times)
# https://www.uuidgenerator.net/
# Combine outputs or use: aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3

# Option 3: Online Random String
# https://www.random.org/strings/
```

### CORS_ALLOWED_ORIGINS
```
# Single domain
https://yourdomain.com

# Multiple domains (comma-separated)
https://beautyonwheel.vercel.app,https://www.beautyonwheel.vercel.app

# With localhost (for testing)
https://yourdomain.com,http://localhost:4200
```

## How Application Profiles Work

### Dev Profile (application-dev.properties)
- Database: localhost:5432
- Use this locally with: `mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"`
- Default profile when no SPRING_PROFILES_ACTIVE is set

### Prod Profile (application-prod.properties)
- Database: Uses environment variables (DB_HOST, DB_PORT, etc.)
- Use this on Render with: `--spring.profiles.active=prod`
- Optimized for production with:
  - Larger connection pool (20 vs 10)
  - WARN logging level
  - Hibernate query batching enabled
  - Response compression enabled

## Connection String Format

The application constructs the database URL as:
```
jdbc:postgresql://{DB_HOST}:{DB_PORT}/{DB_NAME}
```

Example on Render:
```
jdbc:postgresql://dpg-xxxxx.onrender.com:5432/beautyonwheel_prod
```

## Testing Variables Are Set Correctly

After deployment, check logs for:
```
The following profiles are active: prod
[HikariPool-1] Initializing pool with 5 idle connections
```

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Connection refused | DB vars not set | Set DB_HOST, DB_PORT, etc. |
| JWT_SECRET not set | Missing variable | Generate and set JWT_SECRET |
| CORS error | Frontend not allowed | Update CORS_ALLOWED_ORIGINS |
| Wrong profile used | SPRING_PROFILES_ACTIVE not set | Explicitly set to "prod" |
| Port binding error | PORT already used | Render sets PORT=8080 automatically |

## Application Start Command

Render Web Service Start Command:
```
java -jar target/beautyonwheel-auth-service-*.jar --spring.profiles.active=prod
```

This:
- Finds the built JAR file
- Activates the prod profile
- Uses environment variables for configuration

## Troubleshooting Commands

### View all environment variables in Render
1. Dashboard → Web Service → Environment (tab)
2. Look for both "Database" and "Environment Variables" sections

### Check if database connected
1. Look in Logs for:
   ```
   HikariPool-1 pool started successfully
   Hibernate initialization successful
   ```

### Verify environment variables loaded
1. API response should include CORS headers matching CORS_ALLOWED_ORIGINS
2. JWT tokens should be generated successfully
3. Database queries should execute without connection errors

## After Deployment

Test endpoints with:
```bash
# Health check
curl https://beautyonwheel-auth-service.onrender.com/api/v1/health

# Register user
curl -X POST https://beautyonwheel-auth-service.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'
```

Expected response:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---
**Last Updated**: May 30, 2026
**Profile**: Spring Boot 3.3.0 with PostgreSQL 14
