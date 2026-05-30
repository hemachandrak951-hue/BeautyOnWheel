# Vercel + Render Deployment

Use Vercel for the Angular frontend and Render for the Spring Boot backend.

## Frontend: Vercel

Deploy from the repo root using the existing `vercel.json`.

Set this environment variable in Vercel:

```text
VERCEL_API_BASE_URL=https://YOUR_RENDER_BACKEND_URL.onrender.com/api/v1
```

The Vercel build command is already configured:

```text
cd frontend && npm run build:vercel
```

## Backend: Render

Create a Render Web Service from this repository.

Recommended Render settings:

```text
Environment: Docker
Dockerfile Path: ./Dockerfile
Region: choose closest to your users
```

Set these backend environment variables in Render:

```text
SPRING_PROFILES_ACTIVE=prod
DB_HOST=your-postgres-host
DB_PORT=5432
DB_NAME=beautyonwheel_prod
DB_USERNAME=your-postgres-user
DB_PASSWORD=your-postgres-password
JWT_SECRET=your-long-random-secret
CORS_ALLOWED_ORIGINS=https://YOUR_VERCEL_DOMAIN.vercel.app
```

If you use Render PostgreSQL, copy the database host, database name, username, and password from the Render database dashboard into the variables above.

## Check Deployment

After both deployments are live, test the backend directly:

```text
https://YOUR_RENDER_BACKEND_URL.onrender.com/api/v1/home/categories
```

Then open the Vercel frontend and confirm browser DevTools network calls go to:

```text
https://YOUR_RENDER_BACKEND_URL.onrender.com/api/v1/...
```
