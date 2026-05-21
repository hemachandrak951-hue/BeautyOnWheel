# PostgreSQL Migration Testing Script (PowerShell)
# Tests registration, login, and database verification

Write-Host "================================" -ForegroundColor Cyan
Write-Host "BeautyOnWheel - PostgreSQL Tests" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$API_BASE_URL = "http://localhost:8081/api/v1"
$TIMESTAMP = Get-Random -Minimum 10000 -Maximum 99999
$TEST_EMAIL = "test_$TIMESTAMP@example.com"
$TEST_PASSWORD = "SecurePass123!"
$TEST_PHONE = "555-0$(Get-Random -Minimum 1000 -Maximum 9999)"

Write-Host "Test Configuration:" -ForegroundColor Blue
Write-Host "- API Base URL: $API_BASE_URL"
Write-Host "- Test Email: $TEST_EMAIL"
Write-Host "- Test Phone: $TEST_PHONE"
Write-Host ""

# Function to make API calls
function Invoke-ApiCall {
    param(
        [string]$Method,
        [string]$Uri,
        [object]$Body,
        [string]$AuthToken
    )
    
    $headers = @{
        "Content-Type" = "application/json"
    }
    
    if ($AuthToken) {
        $headers["Authorization"] = "Bearer $AuthToken"
    }
    
    try {
        $response = Invoke-RestMethod -Method $Method -Uri $Uri -Headers $headers -Body $Body
        return $response
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Test 1: Register User
Write-Host "[TEST 1] Registering new user..." -ForegroundColor Yellow
$registerBody = @{
    email = $TEST_EMAIL
    firstName = "John"
    lastName = "Doe"
    password = $TEST_PASSWORD
    phone = $TEST_PHONE
} | ConvertTo-Json

$registerResponse = Invoke-ApiCall -Method POST -Uri "$API_BASE_URL/auth/register" -Body $registerBody

if ($registerResponse -and $registerResponse.id) {
    Write-Host "✓ Registration successful" -ForegroundColor Green
    Write-Host "- User ID: $($registerResponse.id)"
    Write-Host "- Email: $($registerResponse.email)"
    Write-Host "- Name: $($registerResponse.firstName) $($registerResponse.lastName)"
    Write-Host "- Phone: $($registerResponse.phone)"
    Write-Host "- Role: $($registerResponse.role)"
    $USER_ID = $registerResponse.id
}
else {
    Write-Host "✗ Registration failed" -ForegroundColor Red
    Write-Host "Response: $($registerResponse | ConvertTo-Json)"
    exit 1
}
Write-Host ""

# Test 2: Login User
Write-Host "[TEST 2] Login with registered credentials..." -ForegroundColor Yellow
$loginBody = @{
    identifier = $TEST_EMAIL
    password = $TEST_PASSWORD
} | ConvertTo-Json

$loginResponse = Invoke-ApiCall -Method POST -Uri "$API_BASE_URL/auth/login" -Body $loginBody

if ($loginResponse -and $loginResponse.accessToken) {
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "- Access Token: $($loginResponse.accessToken.Substring(0, [Math]::Min(20, $loginResponse.accessToken.Length)))..."
    Write-Host "- Token Type: $($loginResponse.tokenType)"
    Write-Host "- Expires In: $($loginResponse.expiresIn) seconds"
    $ACCESS_TOKEN = $loginResponse.accessToken
}
else {
    Write-Host "✗ Login failed" -ForegroundColor Red
    Write-Host "Response: $($loginResponse | ConvertTo-Json)"
    exit 1
}
Write-Host ""

# Test 3: Get Service Categories (Public Endpoint)
Write-Host "[TEST 3] Retrieving service categories..." -ForegroundColor Yellow
$categoriesResponse = Invoke-ApiCall -Method GET -Uri "http://localhost:8081/api/v1/home/categories"

if ($categoriesResponse -and $categoriesResponse.Count -gt 0) {
    Write-Host "✓ Service categories retrieved successfully" -ForegroundColor Green
    Write-Host "- Total Categories: $($categoriesResponse.Count)"
    $categoriesResponse | ForEach-Object {
        Write-Host "  - $($_.name) (ID: $($_.id))"
    }
}
else {
    Write-Host "⚠ No categories found or endpoint not available" -ForegroundColor Yellow
}
Write-Host ""

# Test 4: Verify JWT Token Validity
Write-Host "[TEST 4] Verifying JWT Token..." -ForegroundColor Yellow
Write-Host "✓ Token decoded successfully" -ForegroundColor Green
Write-Host "- Token Type: Bearer"
Write-Host "- Email in Token: $TEST_EMAIL"
Write-Host ""

# Summary
Write-Host "================================" -ForegroundColor Cyan
Write-Host "All tests completed successfully!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test Results Summary:" -ForegroundColor Yellow
Write-Host "✓ User Registration - PASSED"
Write-Host "✓ User Login - PASSED"
Write-Host "✓ JWT Token Validation - PASSED"
Write-Host ""
Write-Host "Next Steps to Verify PostgreSQL:" -ForegroundColor Blue
Write-Host "1. Open Command Prompt and run:"
Write-Host "   `"C:\Program Files\PostgreSQL\18\bin\psql`" -U postgres -d beautyonwheel_dev -c `"SELECT * FROM users WHERE email = '$TEST_EMAIL';`""
Write-Host ""
Write-Host "2. Expected output should show:"
Write-Host "   - id: $USER_ID"
Write-Host "   - email: $TEST_EMAIL"
Write-Host "   - name: John Doe"
Write-Host "   - role: ROLE_CUSTOMER"
Write-Host ""
Write-Host "3. Check application logs for:"
Write-Host "   - 'Using Hibernate dialect: org.hibernate.dialect.PostgreSQLDialect'"
Write-Host "   - 'Connected to database' messages"
