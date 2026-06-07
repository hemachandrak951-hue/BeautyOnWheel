# 🚀 Complete Deployment Guide - BeautyOnWheel Production

> **Your application is ready to deploy!** Both backend and frontend code are configured and pushed to GitHub. Follow these steps to get live.

---

## 📋 Quick Links to Dashboards

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your GitHub Repo**: https://github.com/hemachandrak951-hue/BeautyOnWheel

---

## 🔒 Generate JWT Secret First

Before deploying, generate a strong JWT secret. Use one of these methods:

### Option 1: OpenSSL (Windows)
```powershell
# In PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))
```

### Option 2: Online Generator
Visit https://www.uuidgenerator.net/ and generate multiple UUIDs, then combine them.

### Example JWT_SECRET:
```
aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3w5x7y9z1a3b5c7d9e1f3g5h7i9k1l
```

**⚠️ Save this - you'll need it for Render!**

---

# PART 1: Deploy Backend to Render ☁️

## Step 1.1: Create PostgreSQL Database on Render

1. Go to **https://dashboard.render.com**
2. Click **"New +"** button (top right)
3. Select **"PostgreSQL"**
4. Fill in the form:
   - **Name**: `beautyonwheel-db`
   - **Database**: `beautyonwheel_prod`
   - **User**: `postgres`
   - **Password**: *Leave blank - Render generates one*
   - **Region**: Choose closest to your users (e.g., `Frankfurt`, `Singapore`)
   - **PostgreSQL Version**: `14`
   - **Plan**: `Standard` (recommended for production)
5. Click **"Create Database"**
6. ⏳ **Wait 5-10 minutes** for status to show **"Available"**

**👉 Once "Available", note down:**
- Host
- Port (should be 5432)
- Database name
- User
- Password

---

## Step 1.2: Create Web Service (Backend) on Render

1. Go back to Render dashboard
2. Click **"New +"** button
3. Select **"Web Service"**
4. Choose **"Connect a repository"**
5. Find and select `hemachandrak951-hue/BeautyOnWheel`
6. Fill in the form:
   - **Name**: `beautyonwheel-auth-service`
   - **Environment**: `Docker` (auto-detected) or `Java`
   - **Region**: **Same as PostgreSQL** (important!)
   - **Branch**: `master`
   - **Auto-deploy**: Enable (optional but recommended)

---

## Step 1.3: Configure Build & Start Commands

In the same Web Service form:

**Build Command:**
```
mvn clean package -DskipTests
```

**Start Command:**
```
java -jar target/beautyonwheel-auth-service-*.jar --spring.profiles.active=prod
```

---

## Step 1.4: Connect PostgreSQL Database

1. Scroll down to **"Environment"** section
2. Look for **"Databases"** subsection
3. Click **"+ Add Database"**
4. Select **`beautyonwheel-db`** from the dropdown
5. **This automatically populates:**
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USERNAME`
   - `DB_PASSWORD`

---

## Step 1.5: Add Environment Variables

Still in the **"Environment"** section, manually add these variables:

| Key | Value | Example |
|-----|-------|---------|
| `SPRING_PROFILES_ACTIVE` | `prod` | `prod` |
| `PORT` | `8080` | `8080` |
| `JWT_SECRET` | Your generated secret | `aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3...` |
| `CORS_ALLOWED_ORIGINS` | Your Vercel frontend URL | `https://beautyonwheel.vercel.app,https://www.beautyonwheel.vercel.app` |
| `SERVER_SSL_ENABLED` | `false` | `false` |

**⚠️ Important Notes:**
- `JWT_SECRET`: Use the one you generated earlier
- `CORS_ALLOWED_ORIGINS`: For now, use a placeholder like `https://yourdomain.com` - update after Vercel deployment
- You can add `https://` and `https://www.` variants separated by comma

---

## Step 1.6: Deploy Backend Service

1. Click **"Create Web Service"**
2. 🟡 Render starts building (watch the **"Logs"** tab)
3. ⏳ Wait for completion (~5-10 minutes)
4. ✅ You should see: `"Successfully deployed"`

**Expected logs to see:**
```
The following profiles are active: prod
HikariPool-1 pool started successfully
Hibernate initialization successful
Started BeautyOnWheelApplication
```

---

## Step 1.7: Get Backend URL

1. Once deployment completes, at the top you'll see a URL like:
   ```
   https://beautyonwheel-auth-service.onrender.com
   ```
2. **Copy this URL - you need it for frontend!**

---

## ✅ Test Backend is Working

```bash
# Test health endpoint
curl https://beautyonwheel-auth-service.onrender.com/actuator/health
```

You should get:
```json
{"status":"UP"}
```

---

# PART 2: Deploy Frontend to Vercel 🌐

## Step 2.1: Connect GitHub Repository to Vercel

1. Go to **https://vercel.com/dashboard**
2. Click **"Add New..."** → **"Project"**
3. Click **"Continue with GitHub"** (if not logged in)
4. Search for `BeautyOnWheel` repository
5. Click **"Import"**

---

## Step 2.2: Configure Project Settings

1. **Project Name**: `beautyonwheel` (or your preferred name)
2. **Framework Preset**: `Angular`
3. **Root Directory**: `./frontend`
4. **Build and Output Settings**:
   - **Install Command**: `npm install`
   - **Build Command**: `npm run build:vercel`
   - **Output Directory**: `dist/frontend/browser`

---

## Step 2.3: Add Environment Variables

1. In Vercel project settings, go to **"Environment Variables"**
2. Add this variable:

| Name | Value | Environment |
|------|-------|-------------|
| `NG_APP_API_URL` | `https://beautyonwheel-auth-service.onrender.com/api/v1` | Production |

---

## Step 2.4: Deploy Frontend

1. Click **"Deploy"**
2. ⏳ Vercel builds and deploys (~3-5 minutes)
3. ✅ Watch for **"Production"** status showing green checkmark

---

## Step 2.5: Get Frontend URL

Once deployment completes, you'll see a URL like:
```
https://beautyonwheel-prod.vercel.app
```

**Copy this URL - you'll need it for Render CORS config!**

---

## Step 2.6: Update Backend CORS (Important!)

Now that you have the Vercel URL, update the backend:

1. Go back to **Render Dashboard**
2. Select **`beautyonwheel-auth-service`** Web Service
3. Go to **"Environment"** tab
4. Find `CORS_ALLOWED_ORIGINS`
5. Update the value to:
   ```
   https://beautyonwheel-prod.vercel.app,https://www.beautyonwheel-prod.vercel.app
   ```
6. Click **"Save"**
7. **Service will auto-redeploy** with the new CORS settings

---

# ✅ Testing & Verification

## Test the Full Application

1. **Open Frontend**: https://beautyonwheel-prod.vercel.app
2. **Try Registration** (if available)
3. **Check Browser Console** for any CORS errors
4. **Check Network Tab** to verify API calls succeed

---

## Test API Endpoints

### Health Check
```bash
curl https://beautyonwheel-auth-service.onrender.com/actuator/health
```

### Register User
```bash
curl -X POST https://beautyonwheel-auth-service.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Password123!",
    "firstName":"Test",
    "lastName":"User"
  }'
```

### Get Categories
```bash
curl https://beautyonwheel-auth-service.onrender.com/api/v1/home/categories
```

---

# 📊 Deployment Checklist

- [ ] Generated JWT_SECRET
- [ ] Created PostgreSQL database on Render
- [ ] Created Web Service on Render
- [ ] Connected database to Web Service
- [ ] Set all environment variables on Render
- [ ] Backend deployed successfully (check logs)
- [ ] Got backend URL
- [ ] Imported project to Vercel
- [ ] Configured Vercel build settings
- [ ] Frontend deployed successfully
- [ ] Got frontend URL
- [ ] Updated CORS on Render with frontend URL
- [ ] Tested health endpoint
- [ ] Tested API endpoints
- [ ] Verified CORS is working (check Network tab)

---

# 🎯 Your Production URLs

**Save these for your client!**

```
Frontend (User Dashboard):  https://beautyonwheel-prod.vercel.app
Backend API:                https://beautyonwheel-auth-service.onrender.com/api/v1
Health Check:               https://beautyonwheel-auth-service.onrender.com/actuator/health
```

---

# 🔧 Troubleshooting

### Backend Deployment Failed
- Check build logs in Render dashboard
- Ensure Java build is working: `mvn clean package`
- Verify all environment variables are set
- Check database connection: should see "HikariPool started"

### Frontend Shows Blank Page
- Check browser console for errors
- Verify build succeeded: look for dist folder
- Clear browser cache
- Check that API_URL is correct

### CORS Errors in Frontend
- Verify `CORS_ALLOWED_ORIGINS` includes exact frontend URL
- Include both `https://domain.com` and `https://www.domain.com` variants
- Restart backend service after updating CORS
- Check Network tab in browser DevTools

### Database Connection Refused
- Verify PostgreSQL status shows "Available"
- Check environment variables are connected
- Restart Web Service
- Verify firewall isn't blocking connection

### JWT Token Issues
- Ensure `JWT_SECRET` is set and matches between environments
- Check token expiration: default is 24 hours
- Verify secret is at least 32 characters

---

# 📞 Support Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Spring Boot Docs**: https://spring.io/projects/spring-boot
- **Angular Docs**: https://angular.io/docs

---

# 🎉 Success!

Once everything is deployed and tested:
- Share the **Frontend URL** with your client
- They can access the application directly
- Backend API will handle all authentication & data

---

**Last Updated**: June 7, 2026
**Application**: BeautyOnWheel Auth Service & Dashboard
