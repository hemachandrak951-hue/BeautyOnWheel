# 🚀 Quick Deployment Reference Card

## What's Ready
✅ Backend code configured for production  
✅ Frontend code configured for production  
✅ Environment files set up  
✅ All code pushed to GitHub  

## What You Need to Do

### 1️⃣ Generate JWT Secret (One-time)
```powershell
# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Maximum 256) }))

# Or use: https://www.uuidgenerator.net/
```
**Save this! You'll use it when creating Render service.**

---

### 2️⃣ Deploy Backend to Render (15 minutes)

**Go to**: https://dashboard.render.com

#### Create PostgreSQL:
- Click "New +" → "PostgreSQL"
- Name: `beautyonwheel-db`
- Database: `beautyonwheel_prod`
- Version: 14
- ✅ Wait for "Available" status

#### Create Web Service:
- Click "New +" → "Web Service"  
- Select your GitHub repo
- Name: `beautyonwheel-auth-service`
- Build: `mvn clean package -DskipTests`
- Start: `java -jar target/beautyonwheel-auth-service-*.jar --spring.profiles.active=prod`

#### Environment Variables:
```
SPRING_PROFILES_ACTIVE=prod
PORT=8080
JWT_SECRET=<YOUR_GENERATED_SECRET>
CORS_ALLOWED_ORIGINS=https://yourdomain.com
DB_HOST=<auto-populated>
DB_PORT=<auto-populated>
DB_NAME=<auto-populated>
DB_USERNAME=<auto-populated>
DB_PASSWORD=<auto-populated>
```

✅ Click Deploy → Wait for "Successfully deployed"

**📌 Save this URL:**
```
https://beautyonwheel-auth-service.onrender.com
```

---

### 3️⃣ Deploy Frontend to Vercel (5 minutes)

**Go to**: https://vercel.com/dashboard

#### Import Project:
- Click "Add New..." → "Project"
- Select `BeautyOnWheel` repo
- Root Directory: `./frontend`
- Build Command: `npm run build:vercel`
- Output Directory: `dist/frontend/browser`

#### Environment Variables:
```
NG_APP_API_URL=https://beautyonwheel-auth-service.onrender.com/api/v1
```

✅ Click Deploy → Wait for green checkmark

**📌 Save this URL:**
```
https://beautyonwheel.vercel.app
```

---

### 4️⃣ Update Backend CORS with Frontend URL

Back to Render dashboard:

1. Select `beautyonwheel-auth-service`
2. Go to Environment
3. Update `CORS_ALLOWED_ORIGINS`:
   ```
   https://beautyonwheel.vercel.app,https://www.beautyonwheel.vercel.app
   ```
4. Save → Auto-redeploys

---

## ✅ Test Everything

### Backend Health
```bash
curl https://beautyonwheel-auth-service.onrender.com/actuator/health
# Should return: {"status":"UP"}
```

### Frontend Load
Visit: https://beautyonwheel.vercel.app  
Should load your Angular dashboard

### API Call Test
```bash
curl https://beautyonwheel-auth-service.onrender.com/api/v1/home/categories
# Should return: [list of service categories]
```

---

## 📊 Your Production URLs for Client

```
🌐 Dashboard:  https://beautyonwheel.vercel.app
🔌 API:        https://beautyonwheel-auth-service.onrender.com/api/v1
❤️  Health:     https://beautyonwheel-auth-service.onrender.com/actuator/health
```

**Share the Dashboard URL with your client!**

---

## 🆘 If Something Goes Wrong

### Backend Won't Deploy
1. Check logs in Render
2. Verify Maven build locally: `mvn clean package`
3. Check database is "Available"

### Frontend Shows Blank
1. Check Vercel build logs
2. Clear browser cache
3. Check Network tab for 404s on CSS/JS

### CORS Errors
1. Check exact frontend URL in CORS_ALLOWED_ORIGINS
2. Include both with and without www
3. Restart Render service

### Database Connection Failed
1. Check PostgreSQL shows "Available"
2. Check env vars are connected
3. Verify firewall isn't blocking

---

## 📝 Environment Variables Explained

| Variable | Backend | Frontend | Where |
|----------|---------|----------|-------|
| `JWT_SECRET` | ✅ | ❌ | Render only |
| `CORS_ALLOWED_ORIGINS` | ✅ | ❌ | Render only |
| `DB_HOST`, `DB_PORT`, etc. | ✅ | ❌ | Render (auto) |
| `NG_APP_API_URL` | ❌ | ✅ | Vercel only |

---

## 🔄 Future Updates

### Update Backend
```bash
git push origin master
# Render auto-redeploys
```

### Update Frontend
```bash
git push origin master
# Vercel auto-redeploys
```

### Rollback If Needed
- Render: Go to Deployments tab, select previous version
- Vercel: Go to Deployments tab, click previous version

---

## 📈 Monitoring

### Check Backend Logs (Render)
- Dashboard → beautyonwheel-auth-service → Logs
- Watch for: "HikariPool started", "Hibernate initialized"

### Check Frontend Logs (Vercel)
- Dashboard → beautyonwheel → Deployments → Logs
- Watch for: Build success, no errors

---

## 💰 Costs

**Render (Backend + Database):**
- Web Service: ~$7/month (Standard)
- PostgreSQL: ~$10-15/month (Standard)
- **Total: ~$20/month**

**Vercel (Frontend):**
- Free tier available
- Hobby: Free
- Pro: $20/month

---

**Ready? Follow the 4 steps above!** 🚀

Questions? See: `PRODUCTION_DEPLOYMENT_GUIDE.md`
