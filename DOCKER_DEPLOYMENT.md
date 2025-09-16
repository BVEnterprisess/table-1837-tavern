# Docker Deployment Guide - Table 1837 Tavern

This guide explains how to deploy the Table 1837 Tavern cocktail rolodex application using Docker.

## 🐳 **Quick Start with Docker**

### **Prerequisites:**
- Docker installed on your system
- Docker Compose (usually included with Docker Desktop)

### **1. Clone the Repository:**
```bash
git clone https://github.com/BVEnterprisess/table-1837-tavern.git
cd table-1837-tavern
```

### **2. Build and Run with Docker Compose:**
```bash
# Simple deployment (app only)
docker-compose up -d

# Production deployment (with nginx reverse proxy)
docker-compose --profile production up -d
```

### **3. Access the Application:**
- **Simple deployment:** http://localhost:5000
- **Production deployment:** http://localhost (port 80)

## 🔧 **Manual Docker Commands**

### **Build the Image:**
```bash
docker build -t table-1837-tavern .
```

### **Run the Container:**
```bash
docker run -d \
  --name table-1837-tavern \
  -p 5000:5000 \
  table-1837-tavern
```

### **Run with Persistent Database:**
```bash
docker run -d \
  --name table-1837-tavern \
  -p 5000:5000 \
  -v $(pwd)/data:/app/src/database \
  table-1837-tavern
```

## 🚀 **Production Deployment Options**

### **Option 1: Docker Compose with Nginx**
```bash
# Creates nginx reverse proxy with rate limiting and caching
docker-compose --profile production up -d
```

### **Option 2: Cloud Deployment**

**AWS ECS/Fargate:**
```bash
# Build and push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker build -t table-1837-tavern .
docker tag table-1837-tavern:latest <account>.dkr.ecr.us-east-1.amazonaws.com/table-1837-tavern:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/table-1837-tavern:latest
```

**Google Cloud Run:**
```bash
# Build and deploy to Cloud Run
gcloud builds submit --tag gcr.io/PROJECT-ID/table-1837-tavern
gcloud run deploy --image gcr.io/PROJECT-ID/table-1837-tavern --platform managed
```

**Azure Container Instances:**
```bash
# Build and push to ACR
az acr build --registry myregistry --image table-1837-tavern .
az container create --resource-group myResourceGroup --name table-1837-tavern --image myregistry.azurecr.io/table-1837-tavern:latest
```

## 🔍 **Container Management**

### **View Logs:**
```bash
docker-compose logs -f table-1837-tavern
```

### **Health Check:**
```bash
docker-compose ps
curl http://localhost:5000/health
```

### **Update Application:**
```bash
# Pull latest code
git pull origin master

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### **Backup Database:**
```bash
# Copy database from container
docker cp table-1837-tavern:/app/src/database ./backup/
```

## ⚙️ **Environment Variables**

You can customize the deployment with environment variables:

```yaml
# docker-compose.override.yml
version: '3.8'
services:
  table-1837-tavern:
    environment:
      - FLASK_ENV=production
      - DATABASE_URL=sqlite:///app.db
      - SECRET_KEY=your-secret-key
      - PORT=5000
```

## 🛡️ **Security Considerations**

### **Production Security:**
1. **Use HTTPS:** Configure SSL certificates in nginx.conf
2. **Environment Variables:** Store secrets in environment variables
3. **Network Security:** Use Docker networks to isolate containers
4. **Regular Updates:** Keep base images updated

### **SSL Configuration:**
```bash
# Generate self-signed certificate for testing
mkdir ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem
```

## 📊 **Monitoring**

### **Container Stats:**
```bash
docker stats table-1837-tavern
```

### **Application Metrics:**
- Health endpoint: `/health`
- Application logs: `docker-compose logs`
- System metrics: `docker stats`

## 🔧 **Troubleshooting**

### **Common Issues:**

**Port Already in Use:**
```bash
# Find process using port 5000
lsof -i :5000
# Kill the process or use different port
docker-compose down && docker-compose up -d
```

**Database Issues:**
```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

**Build Failures:**
```bash
# Clean build
docker system prune -a
docker-compose build --no-cache
```

## 📝 **What's Included in the Container**

- **Frontend:** Built React application served by Flask
- **Backend:** Flask API with all endpoints
- **Database:** 700+ cocktail recipes loaded automatically
- **Fall 2025 Menu:** Signature cocktails integrated
- **Static Assets:** All images, CSS, and JavaScript files
- **Health Checks:** Built-in monitoring endpoints

The Docker deployment provides a complete, self-contained cocktail rolodex application ready for production use!

