# 🚀 Kiremon API Deployment Guide

Deploy .NET API lên VPS. Frontend đã trên Vercel, Database dùng Supabase.

## 📊 Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Vercel        │────▶│   VPS           │────▶│   Supabase      │
│   (Frontend)    │     │   (API :5000)   │     │   (PostgreSQL)  │
│   React SPA     │     │   .NET 8        │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## ⚡ Quick Deploy

### 1. SSH vào VPS
```bash
ssh root@your-vps-ip
```

### 2. Cài đặt Docker + Clone repo
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Clone repo
git clone https://github.com/AnPhuoc2410/Kiremon.git /opt/kiremon
cd /opt/kiremon
```

### 3. Cấu hình .env
```bash
cp env.production.example .env
nano .env
```

Điền các giá trị:
```env
# Supabase connection string (lấy từ Supabase Dashboard)
SUPABASE_CONNECTION_STRING=User Id=postgres.xxxxx;Password=xxx;Server=aws-0-ap-southeast-1.pooler.supabase.com;Port=5432;Database=postgres;SSL Mode=Require;Trust Server Certificate=true

# JWT Secret (generate: openssl rand -base64 64)
JWT_SECRET_KEY=your_jwt_secret_key_here

# Admin account
ADMIN_EMAIL=admin@kiremon.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123!

# Vercel frontend URL (cho CORS)
FRONTEND_URL=https://kiremon.vercel.app

# Email SMTP
SMTP_FROM_EMAIL=your@gmail.com
SMTP_USERNAME=your@gmail.com
SMTP_PASSWORD=your_app_password
```

### 4. Deploy
```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh --build
```

### 5. Test
```bash
curl http://localhost:5000/health
```

---

## 🔧 Các lệnh hữu ích

```bash
# Deploy lại (có rebuild)
./deploy/deploy.sh --build

# Deploy nhanh (chỉ pull code mới)
./deploy/deploy.sh

# Xem logs
./deploy/deploy.sh --logs

# Restart API
./deploy/deploy.sh --restart

# Stop API
./deploy/deploy.sh --down

# Check status
./deploy/deploy.sh --status

# Health check
./deploy/deploy.sh --health
```

---

## 🔒 Firewall

```bash
# Chỉ mở port cần thiết
ufw allow ssh
ufw allow 5000/tcp   # API
ufw enable
```

---

## 🌐 Kết nối Vercel với API

Trong Vercel frontend, set environment variable:
```
VITE_API_URL=http://your-vps-ip:5000/api
```

Hoặc nếu có domain:
```
VITE_API_URL=https://api.yourdomain.com/api
```

---

## 🔄 Update Code

```bash
cd /opt/kiremon
./deploy/deploy.sh --build
```

---

## 🔍 Troubleshooting

### API không start
```bash
# Xem logs
docker logs kiremon_api --tail 100

# Check container
docker ps -a
```

### Lỗi kết nối Supabase
- Kiểm tra connection string trong `.env`
- Verify IP VPS được whitelist trong Supabase (nếu có restrict)
- Test connection: `docker exec kiremon_api dotnet ef database update` (nếu cần migrate)

### CORS error từ Vercel
- Kiểm tra `FRONTEND_URL` trong `.env` khớp với URL Vercel
- Restart API: `./deploy/deploy.sh --restart`

### Port 5000 đã được dùng
```bash
lsof -i :5000
kill -9 <PID>
```

---

## 📝 Files quan trọng

| File | Mô tả |
|------|-------|
| `docker-compose.prod.yml` | Docker config cho API |
| `Dockerfile` | Build .NET API |
| `.env` | Environment variables (KHÔNG commit) |
| `deploy/deploy.sh` | Script deploy |

---

**Done! 🎉**
