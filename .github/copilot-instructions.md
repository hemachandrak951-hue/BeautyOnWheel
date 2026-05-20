<!-- GitHub Copilot Instructions for Beauty On Wheel Authentication Microservice -->

# Beauty On Wheel - Auth Service Development Guide

## Project Overview
Production-ready Spring Boot 3.x microservice for user authentication, JWT token management, and service category management for a salon platform.

## Technology Stack
- Java 21
- Spring Boot 3.3.0
- Spring Security with JWT (JJWT 0.12.3)
- Spring Data JPA
- PostgreSQL 14+
- Lombok
- Jakarta Validation API

## Architecture Principles

### Layered Architecture
1. **Entity Layer**: JPA entities with validation annotations
2. **Repository Layer**: Spring Data JPA repositories with custom queries
3. **Service Layer**: Business logic with transaction management
4. **Controller Layer**: REST endpoints with proper HTTP status codes
5. **Exception Layer**: Global exception handling with structured responses
6. **Security Layer**: JWT authentication and CORS configuration

### Design Patterns
- **DTO Pattern**: Request/Response objects for API contracts
- **Service Locator**: Dependency injection via Spring
- **Builder Pattern**: Entity and DTO construction with Lombok
- **Strategy Pattern**: Password encoding strategies (BCrypt)

## Key Components

### 1. Entities
- **User**: Represents salon users with roles (CUSTOMER, STYLIST, ADMIN)
- **ServiceCategory**: Beauty services available on the platform

### 2. Services
- **AuthService**: Handles user registration, login, password hashing
- **ServiceCategoryService**: Manages service categories display

### 3. Controllers
- **AuthController**: `/api/v1/auth/register`, `/api/v1/auth/login`
- **HomeController**: `/api/v1/home/categories`

### 4. Security
- **JwtTokenProvider**: JWT token generation and validation
- **JwtAuthenticationFilter**: Extracts and validates tokens from requests
- **SecurityConfig**: CORS, CSRF, authorization rules

## Development Guidelines

### Code Standards
1. Use Lombok annotations to reduce boilerplate
2. Always use dependency injection via constructor
3. Log at appropriate levels (DEBUG for development, INFO for production)
4. Add JavaDoc for public methods
5. Use meaningful variable names

### Naming Conventions
- Entities: `User`, `ServiceCategory`
- Services: `AuthService`, `ServiceCategoryService`
- Controllers: `AuthController`, `HomeController`
- DTOs: `UserRegistrationRequest`, `AuthTokenResponse`
- Repositories: `UserRepository`, `ServiceCategoryRepository`

### API Response Format
All API responses follow a consistent structure:
- Success: 200/201 with response body
- Client Error: 400/409 with error details
- Server Error: 500 with generic error message

### Testing Strategy
- Unit tests for services and utilities
- Integration tests for controllers and repositories
- Use `@SpringBootTest` for full context tests
- Mock external dependencies

## Configuration

### Development Configuration
- Database: PostgreSQL local instance
- Profiles: `dev`
- Logging: DEBUG level for com.beautyonwheel
- SQL Logging: Enabled
- HTTPS: Disabled

### Production Configuration
- Database: Managed PostgreSQL service
- Profiles: `prod`
- Logging: WARN level
- SQL Logging: Disabled
- HTTPS: Required with certificates
- Secrets: From environment variables

## Common Tasks

### Adding a New API Endpoint
1. Create DTO classes in `dto/` package
2. Create controller method with `@PostMapping` or `@GetMapping`
3. Add business logic to service layer
4. Add validation annotations to DTO
5. Update README with endpoint documentation

### Adding Database Validation
1. Add `@Entity` annotation with table name
2. Use `@UniqueConstraint` for unique columns
3. Add Jakarta validation annotations
4. Update repository with custom queries if needed

### Implementing JWT Protected Endpoint
1. Add authorization requirement in `SecurityConfig`
2. Extract token claims using `JwtTokenProvider`
3. Use `SecurityContextHolder` to access current user
4. Verify user permissions in service layer

## Database Setup

```sql
-- Create database
CREATE DATABASE beautyonwheel_db;

-- Connect to database
\c beautyonwheel_db

-- Tables will be created automatically by Hibernate (ddl-auto=update)
-- For fresh start, use ddl-auto=create-drop in development
```

## Build and Deploy

### Local Development
```bash
mvn clean install
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
```

### Production Build
```bash
mvn clean package -DskipTests
# Deploy the JAR or Docker container
```

## Troubleshooting

### CORS Issues
- Verify frontend is on `localhost:4200`
- Check `corsConfigurationSource()` in `SecurityConfig`
- Ensure `@CrossOrigin` headers are present

### JWT Token Expired
- Check `app.jwt.expiration` value in properties
- Verify system time is synchronized
- Ensure token hasn't been manually tampered

### Database Connection Failed
- Verify PostgreSQL is running
- Check connection parameters in `application-dev.properties`
- Ensure database exists and user has permissions

## Security Best Practices

1. **Never commit secrets**: Use environment variables for production
2. **Validate all inputs**: Use Jakarta validation annotations
3. **Encode passwords**: Always use BCryptPasswordEncoder
4. **HTTPS in production**: Enable SSL/TLS certificates
5. **CORS restrictive**: Only allow trusted origins
6. **Log carefully**: Don't log sensitive information
7. **Update dependencies**: Keep Spring Boot and libraries updated

## Performance Considerations

1. Connection pooling: HikariCP configured with optimal settings
2. N+1 query prevention: Use JPA joins and projections
3. Caching: Consider Redis for frequently accessed data
4. Index strategy: Add indexes on frequently queried columns
5. Pagination: Implement for large result sets

## Documentation

- README.md: Complete setup and API documentation
- Code comments: Explain complex business logic
- JavaDoc: Public API documentation
- Git commits: Clear, descriptive commit messages

## Useful Resources

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- Spring Security: https://spring.io/projects/spring-security
- JJWT Library: https://github.com/jwtk/jjwt
- Jakarta Validation: https://jakarta.ee/specifications/bean-validation/

## Contact & Support

For architecture decisions or technical questions, consult the development team.
Last updated: May 19, 2026
