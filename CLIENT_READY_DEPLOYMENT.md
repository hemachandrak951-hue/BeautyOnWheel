# 🚀 BEAUTYONWHEEL - COMPLETE DEPLOYMENT INSTRUCTIONS

## ⚡ Quick Status
✅ **All code is ready for deployment**  
✅ **All configurations are done**  
✅ **You have full permission to deploy**

---

## 📱 What Your Client Will Get

After following these steps, your client will have:

```
🌐 Web Dashboard: https://beautyonwheel.vercel.app
   - Can access from any browser
   - Mobile responsive
   - Full authentication system
   - Service catalog view

🔐 User Authentication
   - Register with email & password
   - Login securely
   - JWT token-based sessions
   - Secure password encryption

💾 Database
   - Cloud-hosted PostgreSQL
   - Automatic backups
   - Secure data storage
   - No local setup needed
```

---

## 🎯 30-Minute Deployment Plan

### Timeline:
- **2 min**: Generate JWT Secret
- **15 min**: Deploy Backend (Render)
- **5 min**: Deploy Frontend (Vercel)
- **8 min**: Testing & Verification

---

## 📋 STEP 1: Generate JWT Secret (2 minutes)

This is a security key needed for authentication.

### Option A: Windows PowerShell
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))
```

### Option B: Online Generator
Visit: https://www.uuidgenerator.net/  
Click 4 times and combine outputs (or use any 32+ character string)

### Example Output:
```
aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3w5x7y9z1a3b5c7d9e1f3g5h7i9k1l
```

✅ **Save this value** - you'll need it in Step 2

---

## 🔧 STEP 2: Deploy Backend to Render (15 minutes)

### 2.1: Create PostgreSQL Database

1. Go to: **https://dashboard.render.com**
2. Sign up or login (free account)
3. Click **"New +"** (top right button)
4. Select **"PostgreSQL"**

5. Fill the form:
   ```
   Name: beautyonwheel-db
   Database: beautyonwheel_prod
   User: postgres
   Password: [Leave empty - Render generates]
   Region: [Choose closest to users]
   PostgreSQL Version: 14
   Plan: Standard
   ```

6. Click **"Create Database"**
7. ⏳ Wait 5-10 minutes until status shows **"Available"** (green)

### 2.2: Create Web Service (Backend)

1. Go back to Render dashboard
2. Click **"New +"** again
3. Select **"Web Service"**
4. Click **"Connect a repository"**
5. Search for: `BeautyOnWheel`
6. Select: `hemachandrak951-hue/BeautyOnWheel`

7. Fill the form:
   ```
   Name: beautyonwheel-auth-service
   Environment: Java (auto-detected)
   Region: SAME as database from Step 2.1
   Branch: master
   Auto-deploy: ON (recommended)
   ```

### 2.3: Configure Build Commands

Still in the Web Service form:

```
Build Command:
mvn clean package -DskipTests

Start Command:
java -jar target/beautyonwheel-auth-service-*.jar --spring.profiles.active=prod
```

### 2.4: Connect Database

1. Scroll down to **"Environment"** section
2. Look for **"Databases"** 
3. Click **"+ Add Database"**
4. Select **"beautyonwheel-db"** (the one you created)
5. ✅ This auto-fills:
   - DB_HOST
   - DB_PORT
   - DB_NAME
   - DB_USERNAME
   - DB_PASSWORD

### 2.5: Add Environment Variables

In the same **"Environment"** section, add these:

| Key | Value |
|-----|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `PORT` | `8080` |
| `JWT_SECRET` | Paste your generated secret from Step 1 |
| `CORS_ALLOWED_ORIGINS` | `https://yourdomain.com` (update after Step 3) |
| `SERVER_SSL_ENABLED` | `false` |

**Example JWT_SECRET:**
```
aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3w5x7y9z1a3b5c7d9e1f3g5h7i9k1l
```

### 2.6: Deploy Backend

1. Click **"Create Web Service"**
2. Watch the **"Logs"** tab
3. ⏳ Wait 5-10 minutes
4. Look for: **"Successfully deployed"** message

### 2.7: Save Your Backend URL

Once deployed, you'll see a URL like:
```
https://beautyonwheel-auth-service.onrender.com
```

**📌 SAVE THIS - You need it for Step 3**

---

## 🌐 STEP 3: Deploy Frontend to Vercel (5 minutes)

### 3.1: Import to Vercel

1. Go to: **https://vercel.com/dashboard**
2. Sign up or login (free account)
3. Click **"Add New..."** → **"Project"**
4. Click **"Continue with GitHub"**
5. Find and select: `BeautyOnWheel` repository

### 3.2: Configure Project

1. **Project Name**: `beautyonwheel` (or your choice)
2. **Framework**: `Angular` (auto-detected)
3. **Root Directory**: `./frontend`

### 3.3: Build Settings

```
Install Command: npm install
Build Command: npm run build:vercel
Output Directory: dist/frontend/browser
```

### 3.4: Add Environment Variable

Add one variable:

| Name | Value |
|------|-------|
| `NG_APP_API_URL` | Paste your backend URL from Step 2.7 |

**Example:**
```
https://beautyonwheel-auth-service.onrender.com/api/v1
```

### 3.5: Deploy Frontend

1. Click **"Deploy"**
2. ⏳ Wait 3-5 minutes
3. Watch for green **"✓"** checkmark
4. Click the URL to view your live site!

### 3.6: Save Your Frontend URL

Once deployed, you'll see a URL like:
```
https://beautyonwheel.vercel.app
```

**📌 SAVE THIS - Share with your client!**

---

## 🔄 STEP 4: Update Backend CORS (2 minutes)

Now that you have the Vercel URL, update the backend:

1. Go back to **Render Dashboard**
2. Select **"beautyonwheel-auth-service"**
3. Go to **"Environment"** tab
4. Find **`CORS_ALLOWED_ORIGINS`**
5. Change from: `https://yourdomain.com`
6. Change to: (Use your Vercel URL)
   ```
   https://beautyonwheel.vercel.app,https://www.beautyonwheel.vercel.app
   ```
7. Click **"Save"**
8. ✅ Service will auto-restart with new settings

---

## ✅ STEP 5: Verification (5 minutes)

### 5.1: Test Backend Health

```bash
curl https://beautyonwheel-auth-service.onrender.com/actuator/health
```

Expected response:
```json
{"status":"UP"}
```

### 5.2: Test Frontend

1. Visit: `https://beautyonwheel.vercel.app`
2. Should load your Angular dashboard
3. Open browser DevTools (F12)
4. Go to **"Network"** tab
5. Try any action (register, etc.)
6. **Look for**: Green status codes (200, 201)
7. **NO RED ERRORS** = ✅ Working

### 5.3: Test Registration

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

Should return:
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

---

## 🎯 CLIENT SHARING

### What to Share With Your Client

**Share these 2 links:**

```
📱 Dashboard URL:
https://beautyonwheel.vercel.app

📧 Contact for API:
https://beautyonwheel-auth-service.onrender.com/api/v1
```

**Client can immediately:**
- Visit the dashboard
- Register new account
- Login
- View services
- (Any other features you've implemented)

---

## 🆘 Troubleshooting

### Backend Shows "Not Deployed"
- Check Render logs for errors
- Verify Maven build works locally: `mvn clean package`
- Ensure database is "Available"

### Frontend Shows Blank Page
- Check Vercel build logs
- Clear browser cache (Ctrl+Shift+Delete)
- Check API URL is correct
- F12 → Console tab for errors

### "CORS Error: Access Denied"
- Go back to Render
- Update CORS_ALLOWED_ORIGINS with exact Vercel URL
- Save → Service restarts
- Clear browser cache

### "Connection Refused" Error
- PostgreSQL must show "Available" (green)
- Check environment variables are set
- Wait 5 more minutes and retry

---

## 📊 Monitoring Your Deployment

### Check Backend Status
1. Render Dashboard
2. Select "beautyonwheel-auth-service"
3. Look at **"Logs"** tab
4. Should see no RED errors

### Check Frontend Status
1. Vercel Dashboard
2. Select "beautyonwheel"
3. Look at **"Deployments"** tab
4. Latest deployment should have ✅ green checkmark

---

## 🔄 Future Updates

### Update Code
```bash
git push origin master
# Render auto-redeploys in ~5 minutes
# Vercel auto-redeploys in ~3 minutes
```

### Rollback If Needed
- Render: Deployments → Previous version
- Vercel: Deployments → Previous version

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Angular Docs**: https://angular.io/docs

---

## ✨ Security Features

Your deployed application includes:

✅ **HTTPS/SSL** - Encrypted connections (Render + Vercel)  
✅ **JWT Authentication** - Secure token-based auth  
✅ **CORS Protection** - Only your domain can access API  
✅ **Password Hashing** - Industry-standard BCrypt  
✅ **Database Backups** - Automatic by Render  
✅ **Environment Variables** - Secrets never in code  

---

## 💰 Monthly Costs

| Service | Cost | Notes |
|---------|------|-------|
| Render Backend | ~$7-10 | Web service |
| Render Database | ~$10-15 | PostgreSQL |
| Vercel Frontend | $0-20 | Free or Pro |
| **Total** | **~$20-40** | Starting price |

---

## 🎉 You're Done!

Your application is now live in production!

**Next: Share the frontend URL with your client** 👇

```
https://beautyonwheel.vercel.app
```

---

## 📝 Reference Information

### Backend API Endpoints
```
GET  /api/v1/home/categories                    - List categories
POST /api/v1/auth/register                      - Register user
POST /api/v1/auth/login                         - Login user
GET  /actuator/health                           - Health check
```

### Database
- Provider: Render PostgreSQL
- Version: 14
- Name: beautyonwheel_prod
- Automatic backups: Yes

### Frontend
- Provider: Vercel
- Framework: Angular 17
- Styling: Tailwind CSS
- Responsive: Yes

---

**Deployment Complete!** 🚀

Questions? Check the detailed guides in your repository.
