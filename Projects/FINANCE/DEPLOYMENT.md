# 🚀 PRODUCTION DEPLOYMENT GUIDE

## Deploying Your Finance App to Production

This guide covers deploying the Finance App to production environments.

---

## 1. Heroku Deployment (Recommended for Beginners)

### Deploy Backend to Heroku

#### 1.1 Setup
```bash
# Install Heroku CLI
brew install heroku

# Login to Heroku
heroku login

# Create new app
heroku create your-finance-api

# Set environment variables
heroku config:set -a your-finance-api MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/finance"
heroku config:set -a your-finance-api JWT_SECRET="your_very_secret_key_32_chars"
heroku config:set -a your-finance-api FRONTEND_URL="https://your-frontend-domain.com"
heroku config:set -a your-finance-api NODE_ENV="production"
```

#### 1.2 Deploy
```bash
cd server

# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
git push heroku main
```

#### 1.3 Verify
```bash
# Check logs
heroku logs -a your-finance-api --tail

# Test API
curl https://your-finance-api.herokuapp.com/api/health
```

### Deploy Frontend to Vercel

#### 2.1 Setup
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login
```

#### 2.2 Configure
Create `vercel.json`:
```json
{
  "env": {
    "REACT_APP_FIREBASE_API_KEY": "@firebase_api_key",
    "REACT_APP_FIREBASE_AUTH_DOMAIN": "@firebase_auth_domain",
    "REACT_APP_FIREBASE_PROJECT_ID": "@firebase_project_id",
    "REACT_APP_FIREBASE_STORAGE_BUCKET": "@firebase_storage_bucket",
    "REACT_APP_FIREBASE_MESSAGING_SENDER_ID": "@firebase_messaging_sender_id",
    "REACT_APP_FIREBASE_APP_ID": "@firebase_app_id",
    "REACT_APP_FIREBASE_MEASUREMENT_ID": "@firebase_measurement_id",
    "REACT_APP_API_URL": "@api_url",
    "REACT_APP_WS_URL": "@ws_url"
  },
  "buildCommand": "npm run build",
  "outputDirectory": "build"
}
```

#### 2.3 Deploy
```bash
vercel --prod
```

---

## 2. AWS Deployment

### Backend on EC2/Elastic Beanstalk

#### 2.1 Setup EC2 Instance
```bash
# SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Clone repository
git clone your-repo-url
cd FINANCE/server

# Install dependencies
npm install

# Create .env file
nano .env
# Add production environment variables
```

#### 2.2 Setup PM2 for Process Management
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name "finance-api"

# Save PM2 config
pm2 save

# Setup restart on reboot
pm2 startup
```

#### 2.3 Setup Nginx as Reverse Proxy
```bash
# Install Nginx
sudo yum install -y nginx

# Edit nginx config
sudo nano /etc/nginx/nginx.conf

# Add this server block:
```

```nginx
upstream finance_api {
    server localhost:5000;
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://finance_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /socket.io {
        proxy_pass http://finance_api/socket.io;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

```bash
# Start Nginx
sudo service nginx start

# Setup SSL with Let's Encrypt
sudo yum install -y certbot python2-certbot-nginx
sudo certbot certonly --standalone -d your-domain.com
```

### Frontend on S3 + CloudFront

#### 2.4 Build and Upload
```bash
# Build React app
npm run build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## 3. Docker Deployment

### Create Docker Files

#### 3.1 Backend Dockerfile
```dockerfile
# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

#### 3.2 Frontend Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 3.3 Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongo_data:/data/db
    ports:
      - "27017:27017"

  backend:
    build:
      context: ./server
      dockerfile: Dockerfile
    depends_on:
      - mongodb
    environment:
      MONGODB_URI: mongodb://root:password@mongodb:27017/finance_app
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
      FRONTEND_URL: http://localhost:3000
    ports:
      - "5000:5000"

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      REACT_APP_API_URL: http://localhost:5000
      REACT_APP_WS_URL: ws://localhost:5000
    ports:
      - "3000:80"

volumes:
  mongo_data:
```

#### 3.4 Deploy with Docker
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop
docker-compose down
```

---

## 4. DigitalOcean App Platform

### 4.1 Create app.yaml
```yaml
name: finance-app
services:
- name: backend
  github:
    repo: your-username/FINANCE
    branch: main
    deploy_on_push: true
  build_command: cd server && npm install
  run_command: cd server && npm start
  environment_slug: node-js
  http_port: 5000
  envs:
  - key: MONGODB_URI
    value: ${MONGODB_URI}
  - key: JWT_SECRET
    value: ${JWT_SECRET}

- name: frontend
  github:
    repo: your-username/FINANCE
    branch: main
    deploy_on_push: true
  build_command: npm install && npm run build
  run_command: npm start
  http_port: 3000
  envs:
  - key: REACT_APP_API_URL
    value: https://your-app-backend.ondigitalocean.app
```

### 4.2 Deploy
```bash
# Install doctl
brew install doctl

# Create app
doctl apps create --spec app.yaml

# View logs
doctl apps logs <app-id>
```

---

## 5. Production Checklist

### Security
- [ ] Change all default passwords
- [ ] Enable HTTPS/SSL certificates
- [ ] Update CORS settings for production domain
- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Enable rate limiting
- [ ] Enable request logging
- [ ] Setup Web Application Firewall (WAF)
- [ ] Enable DDoS protection

### Performance
- [ ] Setup Redis cache
- [ ] Enable database connection pooling
- [ ] Configure CDN for static assets
- [ ] Enable gzip compression
- [ ] Setup monitoring/alerting
- [ ] Configure automated backups
- [ ] Enable database replication

### Monitoring
- [ ] Setup error tracking (Sentry)
- [ ] Setup APM (New Relic, DataDog)
- [ ] Setup log aggregation (ELK, Splunk)
- [ ] Configure uptime monitoring
- [ ] Setup alerts for critical issues

### Deployment
- [ ] Multiple backend instances
- [ ] Load balancer setup
- [ ] Database backups enabled
- [ ] CI/CD pipeline configured
- [ ] Database migration tested
- [ ] Rollback plan prepared

---

## 6. Environment Variables for Production

### Backend (server/.env)
```env
MONGODB_URI=mongodb+srv://prod_user:prod_pass@cluster.mongodb.net/finance_prod
PORT=5000
NODE_ENV=production
JWT_SECRET=your_production_secret_32_chars_minimum
FRONTEND_URL=https://yourapp.com
LOG_LEVEL=info
REDIS_URL=redis://your-redis-instance:6379
```

### Frontend (.env.production)
```env
REACT_APP_FIREBASE_API_KEY=prod_key
REACT_APP_FIREBASE_AUTH_DOMAIN=prod_domain
REACT_APP_FIREBASE_PROJECT_ID=prod_project
REACT_APP_API_URL=https://api.yourapp.com
REACT_APP_WS_URL=wss://api.yourapp.com
```

---

## 7. CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: success()
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "your-finance-api"
          heroku_email: "your-email@example.com"
```

---

## 8. Scaling Considerations

### Horizontal Scaling
```bash
# Multiple backend instances
heroku ps:scale web=3

# Load balancing with HAProxy
# Database read replicas
```

### Caching Strategy
```javascript
// Cache frequently accessed data
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache transaction summaries for 1 hour
client.setex(`summary:${userId}`, 3600, JSON.stringify(data));
```

---

## 9. Monitoring & Maintenance

### Health Checks
```bash
# Monitor endpoint health
watch -n 60 'curl https://api.yourapp.com/api/health'

# Monitor database
mongosh "your-connection-string" --eval "db.runCommand('ping')"
```

### Log Rotation
```bash
# Configure log rotation
echo "/var/log/finance-app/*.log {
  daily
  rotate 7
  compress
  delaycompress
  notifempty
}" | sudo tee /etc/logrotate.d/finance-app
```

---

## 10. Rollback Procedures

### If Deployment Fails
```bash
# Heroku rollback
heroku rollback -a your-finance-api

# Docker rollback
docker-compose down
docker-compose up -d --build

# Git rollback
git revert HEAD
git push production main
```

---

## 📞 Support & Troubleshooting

### Common Issues

**503 Service Unavailable**
- Check backend is running
- Verify database connection
- Check rate limiting

**WebSocket Connection Failed**
- Verify wss:// is used in production
- Check CORS configuration
- Check firewall rules

**Slow Performance**
- Check database indexes
- Enable Redis caching
- Check for N+1 queries

---

## 📚 Additional Resources

- Heroku: https://devcenter.heroku.com
- AWS: https://aws.amazon.com/documentation
- Docker: https://docs.docker.com
- DigitalOcean: https://docs.digitalocean.com

---

**Good luck with your production deployment! 🚀**

Last updated: April 3, 2026
