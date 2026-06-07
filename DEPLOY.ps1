# Beauty On Wheel - Complete Deployment Guide (PowerShell)
# Deploy to Render (Backend) and Vercel (Frontend)

Write-Host "=========================================" -ForegroundColor Green
Write-Host "Beauty On Wheel - Deployment Script" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

# Function to generate JWT Secret
function Generate-JwtSecret {
    [System.Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))
}

# Step 1: Generate JWT Secret
Write-Host "`n[Step 1] Generating JWT_SECRET..." -ForegroundColor Yellow
$JWT_SECRET = Generate-JwtSecret
Write-Host "JWT_SECRET generated: $JWT_SECRET" -ForegroundColor Green
Write-Host "⚠️  SAVE THIS - You'll need it for Render environment variables!" -ForegroundColor Red

# Step 2: Commit changes to git
Write-Host "`n[Step 2] Committing changes to Git..." -ForegroundColor Yellow
git add .
git commit -m "Production deployment: Updated environment configs for Render and Vercel"
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Changes committed" -ForegroundColor Green
} else {
    Write-Host "✗ Git commit failed" -ForegroundColor Red
}

# Step 3: Push to GitHub
Write-Host "`n[Step 3] Pushing to GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Pushed to GitHub" -ForegroundColor Green
} else {
    Write-Host "✗ Git push failed" -ForegroundColor Red
}

# Step 4: Display deployment instructions
Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "NEXT STEPS FOR DEPLOYMENT" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

Write-Host "`nPART 1: Deploy Backend to Render" -ForegroundColor Yellow
Write-Host "1. Go to: https://dashboard.render.com"
Write-Host "2. Click 'New +' → 'PostgreSQL'"
Write-Host "   - Name: beautyonwheel-db"
Write-Host "   - Database: beautyonwheel_prod"
Write-Host "   - Region: Choose your region"
Write-Host "   - PostgreSQL Version: 14"
Write-Host "3. Wait for database status to show 'Available'"
Write-Host ""
Write-Host "4. Click 'New +' → 'Web Service'"
Write-Host "   - Connect your GitHub repository"
Write-Host "   - Name: beautyonwheel-auth-service"
Write-Host "   - Runtime: Java"
Write-Host "   - Region: Same as database"
Write-Host ""
Write-Host "5. Build Command: mvn clean package -DskipTests"
Write-Host "6. Start Command: java -jar target/beautyonwheel-auth-service-*.jar --spring.profiles.active=prod"
Write-Host ""
Write-Host "7. In Environment tab, connect the PostgreSQL database (auto-populates DB variables)"
Write-Host ""
Write-Host "8. Add these Environment Variables:"
Write-Host "   SPRING_PROFILES_ACTIVE=prod" -ForegroundColor Cyan
Write-Host "   PORT=8080" -ForegroundColor Cyan
Write-Host "   JWT_SECRET=$JWT_SECRET" -ForegroundColor Cyan
Write-Host "   CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>.vercel.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "9. Click 'Deploy' and wait for completion"
Write-Host "10. Copy the backend URL (will be like: https://beautyonwheel-auth-service.onrender.com)"

Write-Host "`nPART 2: Deploy Frontend to Vercel" -ForegroundColor Yellow
Write-Host "1. Go to: https://vercel.com/dashboard"
Write-Host "2. Click 'Add New...' → 'Project'"
Write-Host "3. Select your GitHub repository"
Write-Host "4. Framework: Angular"
Write-Host "5. Root Directory: ./frontend"
Write-Host "6. Build Command: npm run build:vercel"
Write-Host "7. Output Directory: dist/frontend/browser"
Write-Host ""
Write-Host "8. Deploy and get your Vercel URL (will be like: https://beautyonwheel.vercel.app)"
Write-Host "9. Update Render backend CORS_ALLOWED_ORIGINS with your Vercel URL"

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "DEPLOYMENT LINKS" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "📝 Save these after deployment:" -ForegroundColor Green
Write-Host ""
Write-Host "Backend (Render):  https://beautyonwheel-auth-service.onrender.com" -ForegroundColor Cyan
Write-Host "Frontend (Vercel): https://beautyonwheel.vercel.app" -ForegroundColor Cyan
Write-Host ""
Write-Host "API Endpoint:      https://beautyonwheel-auth-service.onrender.com/api/v1" -ForegroundColor Cyan

Write-Host "`nTesting Endpoints:" -ForegroundColor Yellow
Write-Host "Health Check:"
Write-Host "  curl https://beautyonwheel-auth-service.onrender.com/actuator/health"
Write-Host ""
Write-Host "Register User:"
Write-Host "  curl -X POST https://beautyonwheel-auth-service.onrender.com/api/v1/auth/register \"
Write-Host "    -H 'Content-Type: application/json' \"
Write-Host "    -d '{`"email`":`"test@example.com`",`"password`":`"Password123!`"}'"

Write-Host "`n✓ Deployment preparation complete!" -ForegroundColor Green
Write-Host "📌 Go to Render and Vercel dashboards to complete deployment" -ForegroundColor Yellow

# Save JWT Secret to file for reference
$JWT_SECRET | Out-File -FilePath "JWT_SECRET.txt" -Encoding UTF8
Write-Host "`n✓ JWT_SECRET saved to JWT_SECRET.txt" -ForegroundColor Green
Write-Host "⚠️  Keep this file secure and never commit it to Git!" -ForegroundColor Red
