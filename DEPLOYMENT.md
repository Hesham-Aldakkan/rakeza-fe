# Deployment Guide

This guide covers deploying Rakeza Frontend to production environments.

## Table of Contents

1. [Vercel (Recommended)](#vercel-recommended)
2. [Docker Container](#docker-container)
3. [Self-Hosted](#self-hosted)
4. [Environment Configuration](#environment-configuration)
5. [Security Checklist](#security-checklist)
6. [Monitoring & Observability](#monitoring--observability)

---

## Vercel (Recommended)

Vercel is the official Next.js deployment platform and provides the best experience.

### Prerequisites

- Vercel account (https://vercel.com)
- GitHub/GitLab/Bitbucket repository
- Node.js 18+ locally for testing

### Steps

1. **Connect Repository**

   ```bash
   # Option 1: Link existing project
   vercel link

   # Option 2: Deploy from git (Vercel dashboard)
   # - Import project from GitHub
   ```

2. **Configure Environment Variables**

   In Vercel Dashboard → Settings → Environment Variables:

   ```
   NEXT_PUBLIC_API_BASE_URL=https://api.rakeza.com/api
   NEXT_PUBLIC_DEFAULT_LOCALE=ar
   NEXT_PUBLIC_SUPPORTED_LOCALES=ar,en
   NEXT_PUBLIC_SITE_NAME=Rakeza
   NEXT_PUBLIC_BASE_URL=https://rakeza.com
   NEXT_PUBLIC_FEATURE_CHAT=true
   NEXT_PUBLIC_FEATURE_PARALLEL=true
   NEXT_PUBLIC_FEATURE_MEDIATOR=true
   NEXT_PUBLIC_ANALYTICS_ENABLED=true
   NEXT_PUBLIC_ANALYTICS_KEY=<your-analytics-key>
   SENTRY_DSN=<your-sentry-dsn>
   SENTRY_ENVIRONMENT=production
   ```

3. **Set Build Command**

   ```bash
   npm run build
   ```

4. **Set Install Command**

   ```bash
   npm install --legacy-peer-deps
   ```

5. **Deploy**

   ```bash
   vercel --prod
   ```

6. **Verify Deployment**

   - Check domains in Vercel Dashboard
   - Verify environment variables are loaded
   - Run smoke tests (see [Testing](#testing))

### Automatic Deployments

Enable auto-deployments from git:

1. Go to Vercel Dashboard → Settings → Git
2. Enable "Automatic deployments for main branch"
3. (Optional) Enable Preview Deployments for PRs

### Custom Domain

1. In Vercel Dashboard → Domains
2. Add custom domain
3. Update DNS records:
   - `A` record: `76.76.19.132` (Vercel IP)
   - Or use `CNAME`: `cname.vercel-dns.com`

---

## Docker Container

Deploy using Docker containers (suitable for Kubernetes, Docker Swarm, etc.)

### Build Locally

```bash
# Build image
docker build -t rakeza-frontend:latest .

# Test locally
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api \
  -e NEXT_PUBLIC_DEFAULT_LOCALE=ar \
  rakeza-frontend:latest
```

### Push to Registry

```bash
# Docker Hub
docker tag rakeza-frontend:latest username/rakeza-frontend:latest
docker push username/rakeza-frontend:latest

# ECR (AWS)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker tag rakeza-frontend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/rakeza-frontend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/rakeza-frontend:latest
```

### Deploy with Docker Compose

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f rakeza-frontend

# Stop services
docker-compose down
```

### Kubernetes Deployment

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: rakeza-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: rakeza-frontend
  template:
    metadata:
      labels:
        app: rakeza-frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/rakeza-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_BASE_URL
          valueFrom:
            configMapKeyRef:
              name: rakeza-config
              key: api_base_url
        - name: SENTRY_DSN
          valueFrom:
            secretKeyRef:
              name: rakeza-secrets
              key: sentry_dsn
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1024Mi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /ar
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ar
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

Deploy:

```bash
kubectl apply -f k8s/
```

---

## Self-Hosted

### Requirements

- Node.js 18+ with npm
- 2+ vCPU, 2GB+ RAM
- Reverse proxy (Nginx, Apache, Caddy)
- TLS certificate (Let's Encrypt recommended)

### Installation

```bash
# Clone repo
git clone <repo-url>
cd rakeza-frontend

# Install dependencies
npm install --legacy-peer-deps

# Create environment file
cp .env.example .env.local
# Edit .env.local with production values

# Build
npm run build

# Start
npm start
```

### Nginx Configuration

```nginx
upstream nextjs {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name rakeza.com www.rakeza.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name rakeza.com www.rakeza.com;

    ssl_certificate /etc/letsencrypt/live/rakeza.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/rakeza.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    # Caching
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$ {
        proxy_pass http://nextjs;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # API routes
    location /api/ {
        proxy_pass http://nextjs;
        proxy_no_cache 1;
        proxy_cache_bypass 1;
    }

    # All other routes
    location / {
        proxy_pass http://nextjs;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### PM2 Process Manager

```bash
# Install PM2
npm install -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'rakeza-frontend',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOF

# Start
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Logs
pm2 logs rakeza-frontend
```

---

## Environment Configuration

### Required Variables

```bash
# API
NEXT_PUBLIC_API_BASE_URL=https://api.rakeza.com/api

# Localization
NEXT_PUBLIC_DEFAULT_LOCALE=ar
NEXT_PUBLIC_SUPPORTED_LOCALES=ar,en

# Site
NEXT_PUBLIC_SITE_NAME=Rakeza
NEXT_PUBLIC_BASE_URL=https://rakeza.com
NEXT_PUBLIC_OG_IMAGE_URL=https://rakeza.com/og-image.png

# Observability
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_ANALYTICS_KEY=<your-key>
SENTRY_DSN=<your-dsn>
SENTRY_ENVIRONMENT=production
```

### Optional Variables

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_CONTACT_FORM_ENDPOINT=https://your-contact-service.com/api/contact
```

---

## Security Checklist

- [ ] All environment variables are set securely
- [ ] NEXT_PUBLIC_API_BASE_URL points to production API
- [ ] SENTRY_DSN is configured for error tracking
- [ ] SSL/TLS certificate is valid and renewed
- [ ] Security headers are configured (see Nginx example)
- [ ] CSP (Content Security Policy) is enforced
- [ ] CORS is properly configured on backend
- [ ] Rate limiting is enabled on API routes
- [ ] Database backups are automated
- [ ] Monitoring and alerts are set up

---

## Monitoring & Observability

### Application Monitoring

1. **Sentry** (Error Tracking)
   - Already integrated via `src/lib/sentry.ts`
   - Check Sentry dashboard for errors

2. **Analytics** (Usage Tracking)
   - Tracked via `src/lib/analytics.ts`
   - Send data to analytics backend

### Infrastructure Monitoring

1. **Uptime Monitoring**

   ```bash
   # Using Uptime Robot, StatusCake, or similar
   # Monitor: https://rakeza.com/ar
   # Check every 5 minutes
   ```

2. **Performance Monitoring**

   ```bash
   # Lighthouse CI
   npm install -g @lhci/cli@latest
   lhci autorun
   ```

3. **Logs**

   ```bash
   # View production logs
   vercel logs         # Vercel
   docker logs -f rakeza-frontend  # Docker
   pm2 logs           # PM2
   ```

### Database Backups

```bash
# Daily backups to S3 (example)
0 2 * * * /usr/local/bin/backup-db.sh
```

---

## Troubleshooting

### Build Fails

```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Check for hardcoded values
grep -r "localhost:3001" src/
```

### Runtime Errors

```bash
# Check environment variables
echo $NEXT_PUBLIC_API_BASE_URL

# View logs
pm2 logs rakeza-frontend
docker logs rakeza-frontend

# Check Sentry dashboard
```

### Performance Issues

```bash
# Check build output
npm run build

# Analyze bundle
npm run build -- --analyze

# Check Core Web Vitals
# https://web.dev/vitals/
```

---

## Support

For deployment issues:
- Check logs
- Verify environment variables
- Consult Vercel/Docker/server docs
- Open an issue on GitHub

---

**Last Updated**: 2024-01-15
