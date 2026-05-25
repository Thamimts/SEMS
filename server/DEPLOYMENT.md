# SEMS Backend Deployment Guide

This guide covers deploying the SEMS backend to various platforms.

## 📦 Prerequisites

- Node.js 14+
- npm or yarn
- MongoDB instance (cloud or self-hosted)
- Environment variables configured

## 🐳 Docker Deployment

### 1. Build Docker Image

```bash
docker build -t sems-backend:latest .
```

### 2. Run Container

```bash
docker run -d \
  -p 5000:5000 \
  -e MONGODB_URI=mongodb://mongodb:27017/sems \
  -e JWT_SECRET=your_secret_key \
  -e NODE_ENV=production \
  --name sems-backend \
  sems-backend:latest
```

### 3. Docker Compose Setup

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password

  sems-backend:
    build: ./server
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      MONGODB_URI: mongodb://root:password@mongodb:27017/sems?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    restart: unless-stopped

volumes:
  mongodb_data:
```

Run with:
```bash
docker-compose up -d
```

## 🚀 Heroku Deployment

### 1. Install Heroku CLI

```bash
npm install -g heroku
heroku login
```

### 2. Create Heroku App

```bash
heroku create sems-backend
```

### 3. Add MongoDB (MongoDB Atlas recommended)

```bash
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sems
```

### 4. Set Environment Variables

```bash
heroku config:set JWT_SECRET=your_secret_key
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-frontend-url.com
```

### 5. Deploy

```bash
git push heroku main
```

### 6. View Logs

```bash
heroku logs --tail
```

## AWS Deployment

### Option 1: Elastic Beanstalk

#### 1. Install EB CLI

```bash
pip install awsebcli --upgrade --user
```

#### 2. Initialize EB Application

```bash
eb init -p node.js-18 sems-backend
```

#### 3. Create Environment

```bash
eb create sems-backend-env
```

#### 4. Configure Environment Variables

```bash
eb setenv MONGODB_URI=mongodb+srv://... JWT_SECRET=... NODE_ENV=production
```

#### 5. Deploy

```bash
eb deploy
```

### Option 2: EC2 + PM2

#### 1. SSH into EC2 Instance

```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

#### 2. Install Dependencies

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

#### 3. Clone Repository

```bash
git clone https://github.com/your-repo/sems.git
cd sems/server
npm install
```

#### 4. Configure Environment

```bash
cp .env.example .env
# Edit .env with production values
```

#### 5. Start with PM2

```bash
pm2 start server.js --name "sems-backend"
pm2 startup
pm2 save
```

#### 6. Setup Nginx Reverse Proxy

```bash
sudo apt-get install -y nginx
sudo vi /etc/nginx/sites-available/default
```

Configure:
```nginx
upstream sems_backend {
  server localhost:5000;
}

server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://sems_backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

#### 7. Setup SSL with Let's Encrypt

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Google Cloud Run Deployment

### 1. Build and Push Image

```bash
gcloud builds submit --tag gcr.io/your-project/sems-backend
```

### 2. Deploy to Cloud Run

```bash
gcloud run deploy sems-backend \
  --image gcr.io/your-project/sems-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars MONGODB_URI=mongodb+srv://...,JWT_SECRET=...
```

## MongoDB Atlas Setup

### 1. Create Cluster

- Go to mongodb.com/cloud
- Create account and cluster
- Choose region and tier

### 2. Create Database User

- Go to Database Access
- Create user with password

### 3. Get Connection String

- Go to Databases
- Click Connect
- Select "Connect your application"
- Copy connection string

### 4. Whitelist IP

- Go to Network Access
- Add current IP or 0.0.0.0/0 (for testing only)

### 5. Use in Environment

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sems?retryWrites=true&w=majority
```

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure strong `JWT_SECRET`
- [ ] Setup HTTPS/SSL certificates
- [ ] Configure CORS_ORIGIN with frontend URL only
- [ ] Setup MongoDB backups
- [ ] Enable MongoDB authentication
- [ ] Configure firewall rules
- [ ] Setup monitoring and logging
- [ ] Configure health check endpoint
- [ ] Setup auto-scaling (if using cloud)
- [ ] Enable GZIP compression
- [ ] Setup rate limiting
- [ ] Configure error tracking (Sentry)
- [ ] Enable database connection pooling
- [ ] Setup log aggregation

## Monitoring & Logging

### PM2 Monitoring

```bash
# Install monitoring
pm2 install pm2-logrotate

# View logs
pm2 logs sems-backend

# Monitor
pm2 monit
```

### CloudWatch (AWS)

```bash
# Install agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/amazon_linux/amd64/latest/amazon-cloudwatch-agent.rpm
sudo rpm -U ./amazon-cloudwatch-agent.rpm
```

### Datadog Integration

```bash
npm install --save dd-trace
```

Then in server.js:
```javascript
const tracer = require('dd-trace').init();
```

## Performance Optimization

### 1. Enable Compression

```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Database Indexing

Ensure all indexes are created:
```bash
# This happens automatically in database.js
```

### 3. Redis Caching (Optional)

```bash
npm install redis
```

### 4. Load Balancing

Use Nginx or AWS ELB to distribute traffic across multiple instances.

### 5. Socket.IO Scaling

For multiple instances, use Redis adapter:

```javascript
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const pubClient = createClient();
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

## Backup Strategy

### MongoDB Automated Backups

```bash
# Create daily backup script
0 2 * * * mongodump --uri="mongodb+srv://user:pass@cluster/sems" --out=/backups/$(date +\%Y\%m\%d)
```

### Restore from Backup

```bash
mongorestore --uri="mongodb+srv://user:pass@cluster/sems" /backups/backup-date/
```

## Rollback Strategy

### Using Git Tags

```bash
# Tag release
git tag v1.0.0
git push origin v1.0.0

# Rollback
git checkout v1.0.0
npm install
npm start
```

### Using Docker

```bash
# Keep multiple versions
docker tag sems-backend:latest sems-backend:v1.0.0
docker push your-registry/sems-backend:v1.0.0

# Rollback
docker pull your-registry/sems-backend:v1.0.0
docker run -d your-registry/sems-backend:v1.0.0
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use strong, random secret (32+ characters)
3. **HTTPS Only**: Always use HTTPS in production
4. **CORS**: Configure specific origins, not `*`
5. **Rate Limiting**: Add rate limits to prevent abuse
6. **Input Validation**: Validate all user inputs
7. **SQL Injection**: Use parameterized queries (MongoDB is safe by default)
8. **XSS Protection**: Sanitize user input
9. **CSRF Protection**: Implement CSRF tokens if needed
10. **Secrets Management**: Use services like HashiCorp Vault or AWS Secrets Manager

## Continuous Deployment

### GitHub Actions Example

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to EB
        run: |
          eb init -p node.js-18 sems-backend
          eb deploy
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

## Troubleshooting Deployment

### Port Already in Use

```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Timeout

- Check connection string
- Verify IP whitelist in MongoDB Atlas
- Check network connectivity

### Socket.IO Not Working

- Verify CORS configuration
- Check WebSocket support
- Test with `socket.io-client`

### Memory Leaks

```bash
# Monitor with PM2
pm2 start server.js --max-memory-restart 500M
```

## Performance Benchmarking

```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:5000/health

# Using wrk
wrk -t12 -c400 -d30s http://localhost:5000/health
```

---

**Questions?** Check the main README.md or open an issue in the repository.
