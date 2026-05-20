# Beauty On Wheel - Authentication & Onboarding Microservice

## Overview

Production-ready Spring Boot 3.x microservice for user authentication, registration, and homepage navigation layer of a Yes Madam-like doorstep salon platform. Built with enterprise-grade security, stateless JWT authentication, and comprehensive API endpoints.

## Technology Stack

- **Java 21** - Latest LTS version
- **Spring Boot 3.3.0** - Latest major version
- **Spring Security 6.x** - OAuth2 & JWT support
- **Spring Data JPA** - Object-relational mapping
- **PostgreSQL 14+** - Production database
- **JJWT 0.12.3** - JSON Web Token library
- **Lombok** - Boilerplate reduction
- **Jakarta Validation API** - Bean validation
- **Maven 3.8+** - Build tool

## Project Structure

```
beautyonwheel/
├── src/main/java/com/beautyonwheel/
│   ├── entity/              # JPA entities (User, ServiceCategory)
│   ├── repository/          # JPA repositories
│   ├── service/             # Business logic (AuthService, CategoryService)
│   ├── controller/          # REST controllers (AuthController, HomeController)
│   ├── dto/                 # Data transfer objects
│   ├── config/              # Spring configuration (Security, JWT)
│   ├── security/            # JWT provider and utilities
│   ├── exception/           # Custom exceptions and global handler
│   └── BeautyOnWheelApplication.java
├── src/main/resources/
│   ├── application.properties
│   ├── application-dev.properties
│   └── application-prod.properties
├── pom.xml
└── README.md
```

## Database Schema

### User Entity
```
users (PostgreSQL table)
├── id (BIGSERIAL, PRIMARY KEY)
├── name (VARCHAR, NOT NULL)
├── email (VARCHAR, UNIQUE, NOT NULL)
├── phone (VARCHAR, UNIQUE, NOT NULL)
├── date_of_birth (DATE)
├── password_hash (VARCHAR, NOT NULL)
├── role (ENUM: ROLE_CUSTOMER, ROLE_STYLIST, ROLE_ADMIN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### ServiceCategory Entity
```
service_categories (PostgreSQL table)
├── id (BIGSERIAL, PRIMARY KEY)
├── name (VARCHAR, UNIQUE, NOT NULL)
├── image_url (VARCHAR)
├── description (TEXT)
├── is_active (BOOLEAN, DEFAULT: true)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## API Endpoints

### Authentication Endpoints

#### 1. User Registration
```
POST /api/v1/auth/register
Content-Type: application/json

Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "dateOfBirth": "1990-05-15",
  "password": "SecurePass123!@#",
  "role": "ROLE_CUSTOMER"
}

Response: 201 Created
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "dateOfBirth": "1990-05-15",
  "role": "ROLE_CUSTOMER",
  "createdAt": "2026-05-19T10:30:00",
  "updatedAt": "2026-05-19T10:30:00"
}
```

#### 2. User Login
```
POST /api/v1/auth/login
Content-Type: application/json

Request:
{
  "identifier": "john@example.com",
  "password": "SecurePass123!@#"
}

Response: 200 OK
{
  "access_token": "eyJhbGciOiJIUzUxMiJ9...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "dateOfBirth": "1990-05-15",
    "role": "ROLE_CUSTOMER",
    "createdAt": "2026-05-19T10:30:00",
    "updatedAt": "2026-05-19T10:30:00"
  }
}
```

### Homepage Endpoints

#### 3. Get Service Categories (Public)
```
GET /api/v1/home/categories

Response: 200 OK
[
  {
    "id": 1,
    "name": "Hair Services",
    "imageUrl": "https://example.com/hair.jpg",
    "description": "Professional hair care and styling",
    "isActive": true
  },
  {
    "id": 2,
    "name": "Facial Treatments",
    "imageUrl": "https://example.com/facial.jpg",
    "description": "Premium facial care packages",
    "isActive": true
  }
]
```

## Error Response Format

All errors follow a structured JSON format:

```json
{
  "status": 400,
  "message": "Validation failed",
  "error": "Invalid input parameters",
  "timestamp": "2026-05-19T10:35:00",
  "path": "/api/v1/auth/register",
  "fieldErrors": {
    "email": ["Email should be valid"],
    "password": ["Password must contain uppercase, lowercase, digit, and special character"]
  }
}
```

## Prerequisites

- **Java 21** or higher
- **Maven 3.8** or higher
- **PostgreSQL 14** or higher
- **Git** (for version control)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourorg/beautyonwheel.git
cd beautyonwheel
```

### 2. Configure PostgreSQL Database

Create a new PostgreSQL database:
```sql
CREATE DATABASE beautyonwheel_db OWNER postgres;
GRANT ALL PRIVILEGES ON DATABASE beautyonwheel_db TO postgres;
```

### 3. Update Application Properties

Edit `src/main/resources/application-dev.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/beautyonwheel_db
spring.datasource.username=postgres
spring.datasource.password=your_password
app.jwt.secret=your-super-secret-key-min-32-characters-required
```

### 4. Build the Project
```bash
mvn clean install
```

### 5. Run the Application

**Development Mode:**
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

**Production Mode:**
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

The application will start on `http://localhost:8080`

## Security Features

### JWT Authentication
- Stateless token-based authentication
- HS512 signing algorithm
- 24-hour token expiration (configurable)
- Secure token validation and refresh

### CORS Configuration
- Configured for Angular frontend on `localhost:4200`
- Allowed methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Credentials support enabled

### Password Security
- BCrypt hashing with salt
- Strong password validation:
  - Minimum 8 characters
  - Must contain uppercase letters
  - Must contain lowercase letters
  - Must contain digits
  - Must contain special characters

### Input Validation
- Email format validation
- Phone number format validation
- Date validation (DOB must be in past)
- Custom field-level validators

### Global Exception Handling
- Centralized error handling with `@RestControllerAdvice`
- Structured JSON error responses
- Field-level validation error details
- HTTP status code mapping

## Development Workflow

### Build
```bash
mvn clean package
```

### Run Tests
```bash
mvn test
```

### Run with Debug Logging
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--logging.level.com.beautyonwheel=DEBUG"
```

### Format Code
```bash
mvn spotless:apply
```

## Deployment

### Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/beautyonwheel-auth-service-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","app.jar","--spring.profiles.active=prod"]
```

Build and run:
```bash
docker build -t beautyonwheel-auth-service:1.0.0 .
docker run -p 8080:8080 \
  -e DB_HOST=postgres \
  -e DB_PORT=5432 \
  -e DB_NAME=beautyonwheel_prod \
  -e JWT_SECRET=your-production-secret \
  beautyonwheel-auth-service:1.0.0
```

## Environment Variables (Production)

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | PostgreSQL host | `prod-db.example.com` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `beautyonwheel_prod` |
| `DB_USERNAME` | Database user | `app_user` |
| `DB_PASSWORD` | Database password | Secure password |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | Random string |
| `SSL_KEYSTORE_PATH` | SSL certificate path | `/etc/ssl/keystore.p12` |
| `SSL_KEYSTORE_PASSWORD` | Keystore password | Secure password |

## Testing

### Integration Tests
```bash
mvn verify
```

### Test Coverage
```bash
mvn jacoco:report
```

## Monitoring & Logging

### Health Check Endpoint
```bash
curl http://localhost:8080/actuator/health
```

### Log Levels
- Development: DEBUG
- Production: INFO/WARN

## Common Issues & Solutions

### Issue: Database Connection Failed
**Solution:** Verify PostgreSQL is running and connection details are correct.
```bash
psql -h localhost -U postgres -d beautyonwheel_db
```

### Issue: JWT Token Validation Fails
**Solution:** Ensure JWT secret is consistent and token hasn't expired.
```bash
# Check token validity
curl -H "Authorization: Bearer <token>" http://localhost:8080/api/v1/auth/profile
```

### Issue: CORS Errors from Angular Frontend
**Solution:** Verify frontend is running on `localhost:4200` and CORS configuration is enabled.

## Useful Commands

```bash
# View active profiles
curl http://localhost:8080/actuator/env | grep active

# Database schema info
psql -h localhost -U postgres -d beautyonwheel_db -c "\dt"

# Clear database (development only)
mvn flyway:clean
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

## License

© 2026 Beauty On Wheel. All rights reserved.

## Support

For issues and questions, please contact the development team or create an issue in the repository.

---

**Last Updated:** May 19, 2026  
**Version:** 1.0.0  
**Maintainer:** Enterprise Software Architecture Team
