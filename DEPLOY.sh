#!/bin/bash
# Beauty On Wheel - Complete Deployment Guide
# Deploy to Render (Backend) and Vercel (Frontend)

echo "========================================="
echo "Beauty On Wheel - Deployment Script"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Generate JWT Secret
echo -e "${YELLOW}[Step 1] Generating JWT_SECRET...${NC}"
JWT_SECRET=$(openssl rand -base64 32)
echo -e "${GREEN}JWT_SECRET generated: $JWT_SECRET${NC}"
echo "⚠️  SAVE THIS - You'll need it for Render environment variables!"

# Step 2: Commit changes to git
echo -e "\n${YELLOW}[Step 2] Committing changes to Git...${NC}"
git add .
git commit -m "Production deployment: Updated environment configs for Render and Vercel"
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Changes committed${NC}"
else
    echo -e "${RED}✗ Git commit failed${NC}"
fi

# Step 3: Push to GitHub
echo -e "\n${YELLOW}[Step 3] Pushing to GitHub...${NC}"
git push origin main
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Pushed to GitHub${NC}"
else
    echo -e "${RED}✗ Git push failed${NC}"
fi

# Step 4: Display deployment instructions
echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}NEXT STEPS FOR DEPLOYMENT${NC}"
echo -e "${GREEN}=========================================${NC}"

echo -e "\n${YELLOW}PART 1: Deploy Backend to Render${NC}"
echo "1. Go to: https://dashboard.render.com"
echo "2. Click 'New +' → 'PostgreSQL'"
echo "   - Name: beautyonwheel-db"
echo "   - Database: beautyonwheel_prod"
echo "   - Region: Choose your region"
echo "   - PostgreSQL Version: 14"
echo "3. Wait for database status to show 'Available'"
echo ""
echo "4. Click 'New +' → 'Web Service'"
echo "   - Connect your GitHub repository"
echo "   - Name: beautyonwheel-auth-service"
echo "   - Runtime: Java"
echo "   - Region: Same as database"
echo ""
echo "5. Build Command: mvn clean package -DskipTests"
echo "6. Start Command: java -jar target/beautyonwheel-auth-service-*.jar --spring.profiles.active=prod"
echo ""
echo "7. In Environment tab, connect the PostgreSQL database (auto-populates DB variables)"
echo ""
echo "8. Add these Environment Variables:"
echo "   SPRING_PROFILES_ACTIVE=prod"
echo "   PORT=8080"
echo "   JWT_SECRET=$JWT_SECRET"
echo "   CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>.vercel.app"
echo ""
echo "9. Click 'Deploy' and wait for completion"
echo "10. Copy the backend URL (will be like: https://beautyonwheel-auth-service.onrender.com)"

echo -e "\n${YELLOW}PART 2: Deploy Frontend to Vercel${NC}"
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Click 'Add New...' → 'Project'"
echo "3. Select your GitHub repository"
echo "4. Framework: Angular"
echo "5. Root Directory: ./frontend"
echo "6. Build Command: npm run build:vercel"
echo "7. Output Directory: dist/frontend/browser"
echo ""
echo "8. Deploy and get your Vercel URL (will be like: https://beautyonwheel.vercel.app)"
echo "9. Update Render backend CORS_ALLOWED_ORIGINS with your Vercel URL"

echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}DEPLOYMENT LINKS${NC}"
echo -e "${GREEN}=========================================${NC}"
echo "📝 Save these after deployment:"
echo ""
echo "Backend (Render):  https://beautyonwheel-auth-service.onrender.com"
echo "Frontend (Vercel): https://beautyonwheel.vercel.app"
echo ""
echo "API Endpoint:      https://beautyonwheel-auth-service.onrender.com/api/v1"

echo -e "\n${YELLOW}Testing Endpoints:${NC}"
echo "Health Check:"
echo "  curl https://beautyonwheel-auth-service.onrender.com/actuator/health"
echo ""
echo "Register User:"
echo "  curl -X POST https://beautyonwheel-auth-service.onrender.com/api/v1/auth/register \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -d '{\"email\":\"test@example.com\",\"password\":\"Password123!\"}'"

echo -e "\n${GREEN}✓ Deployment preparation complete!${NC}"
echo "📌 Go to Render and Vercel dashboards to complete deployment"
