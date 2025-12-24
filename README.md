<div align="center">

# 🎮 Kiremon - Pokemon Web Game

<p align="center">
  <img src="https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet" alt=".NET 8.0"/>
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL"/>
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript"/>
</p>

**Ứng dụng web game Pokemon fullstack với .NET 8, React 19, SignalR - Clean Architecture & Modern Tech Stack**

[🎮 Live Demo](https://kiremon.vercel.app) • [🐛 Report Bug](https://github.com/AnPhuoc2410/Kiremon/issues)

</div>

---

## 🌟 Giới thiệu

Dự án cá nhân kết hợp đam mê Pokemon và công nghệ web hiện đại. Xây dựng từ đầu với trải nghiệm game Pokemon hoàn chỉnh trên web.

**Highlights:**
- 🎯 Game Mechanics chân thực (IV, Nature, Shiny, Catch Rate)
- 🔐 Authentication đa dạng (JWT, OAuth2, 2FA)
- 🚀 Real-time với SignalR
- 📊 Clean Architecture & SOLID principles

---

## 🎨 Screenshots

### 🏠 Home Page
![Home Page](/pokedexreactasp.client/public/images/home.png)
*Trang chủ với giao diện hiện đại, hiển thị Pokemon featured và navigation*

### 🎮 Pokemon Catching
![Catch Pokemon](/pokedexreactasp.client/public/images/catch.png)
*Hệ thống bắt Pokemon với animations và real-time feedback*

### 📱 Pokemon Detail
![Pokedex](/pokedexreactasp.client/public/images/detail.jpeg)
*Thông tin với thông số chung*


### 📊 Pokemon Stats
![Stats](/pokedexreactasp.client/public/images/stats.jpeg)
![Breed](/pokedexreactasp.client/public/images/breed.jpeg)
![Move](/pokedexreactasp.client/public/images/moves.jpeg)
*Chi tiết thông tin Pokemon: IV, Nature, moves, abilities*

### ⚡ Evolution System
![Evolution](/pokedexreactasp.client/public/images/evolution.jpeg)
![Evolution2](/pokedexreactasp.client/public/images/evolution_2.jpeg)
![Evolution3](/pokedexreactasp.client/public/images/evolution_3.jpeg)
*Pokemon evolution interface với điều kiện tiến hóa*

### 👤 User Profile
![Profile](/pokedexreactasp.client/public/images/profile.jpeg)
![MyPoke](/pokedexreactasp.client/public/images/my_pokemon.jpeg)
*User profile với Pokemon collection và stats*


---

## ✨ Tính năng chính

**Game Mechanics**
- Pokemon Catching với công thức chính thống
- IV System (6 stats: 0-31), Nature System (25 types)
- Shiny Pokemon (1/4096), Pokédex tracking
- Stats calculation chính xác

**Security**
- JWT + OAuth2 (Google, Facebook, Microsoft)
- Two-Factor Authentication (TOTP)
- reCAPTCHA v3, Rate Limiting
- Email verification & password reset

**Real-time**
- SignalR notifications
- Live Pokemon catch updates
- Event system

---

## 🛠 Tech Stack

**Backend:** .NET 8 • EF Core • PostgreSQL • SignalR • ASP.NET Identity • JWT

**Frontend:** React 19 • TypeScript • Vite • TailwindCSS • Radix UI • Axios

**DevOps:** Docker • Vercel • VPS • Nginx • Supabase

---

## 🏗 Architecture

**Clean Architecture:** Domain → Application → Infrastructure → Presentation

**Deployment:** Vercel (React) → VPS (Nginx + Docker) → Supabase (PostgreSQL)

---

## 🚀 Roadmap

**✅ Completed:** Pokemon catching, IV/Nature, Shiny, Pokédex, Authentication

**🔄 In Progress:** Battle System, Evolution, Trading, Breeding, Achievements

**📋 Planned:** PvP, Guild, Chat, Marketplace, Tournaments

**💡 Future:** PWA, Mobile App, Events, Weather System, Microservices

---

## 💻 Quick Start

```bash
# Clone & Setup
git clone https://github.com/AnPhuoc2410/Kiremon.git
cd Kiremon
cp env.production.example .env

# Docker
docker-compose -f docker-compose.dev.yml up --build

# Manual: Backend (localhost:7028) + Frontend (localhost:5173)
cd PokedexReactASP.Server && dotnet run
cd pokedexreactasp.client && npm install && npm run dev
```

---

## 🚢 Deployment

**Frontend:** Vercel (GitHub auto-deploy)

**Backend:** VPS + Docker + Nginx + SSL

**Database:** Supabase PostgreSQL

> Chi tiết: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🎯 Điểm nổi bật

**Architecture**
- Clean Architecture, SOLID principles
- Repository & Service patterns
- Full type safety (TypeScript + C#)

**Security**
- Multi-layer defense (JWT, 2FA, reCAPTCHA, Rate Limiting)
- OAuth2/OpenID Connect
- HTTPS, CSRF, SQL Injection prevention

**Performance**
- Caching strategy (In-Memory, Redis-ready)
- Database optimization
- Code splitting, lazy loading

---

## 📚 Bài học từ dự án

**Technical Skills:**
- Clean Architecture trong thực tế
- JWT + OAuth2 + 2FA authentication
- EF Core relationships & migrations
- SignalR real-time communication
- React 19 + TypeScript best practices
- Docker containerization & VPS deployment

**Challenges & Solutions:**
- PokeAPI data complexity → DTOs + caching
- Multi-provider auth → ASP.NET Identity mapping
- SignalR scaling → Connection tracking + Redis ready
- Environment consistency → Docker

**Improvements:**
- Viết tests từ đầu
- Database design kỹ hơn (migrations rất painful)
- Setup logging & monitoring sớm hơn
- API versioning từ ngày 1

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

## 📞 Contact

**Phuoc An** - Fullstack Developer

📧 [an.phuoc2410@gmail.com](mailto:an.phuoc2410@gmail.com) • 🐙 [@AnPhuoc2410](https://github.com/AnPhuoc2410)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Phuoc An](https://github.com/AnPhuoc2410)

</div>


---

## 🛠 Tech Stack

**Backend:** .NET 8 • EF Core • PostgreSQL • SignalR • ASP.NET Identity • JWT

**Frontend:** React 19 • TypeScript • Vite • TailwindCSS • Radix UI • Axios

**DevOps:** Docker • Vercel • VPS • Nginx • Supabase

**APIs:** PokéAPI • OAuth2 (Google, Facebook, Microsoft) • reCAPTCHA v3

---

## 🏗 Kiến trúc hệ thống

### Clean Architecture
**Clean Architecture:** Domain → Application → Infrastructure → Presentation

**Deployment:**
```
Vercel (React) → VPS (Nginx + Docker) → Supabase (PostgreSQL)
```
- [ ] **Native Mobile Apps**: React Native version
- [ ] **Geolocation**: Location-based Pokemon spawns

### 🛡 Phase 5: Advanced Features (💡 Future)
- [ ] **Event System**: Limited-time events, seasonal Pokemon
- [ ] **Item Shop**: Buy Poke Balls, potions, items
- [ ] **Weather System**: Weather affects spawn rates & types
- [ ] **Day/Night Cycle**: Time-based Pokemon spawns
- [ ] **Analytics Dashboard**: Player behavior analytics
- [ ] **Admin Panel**: Moderation, user management
- [ ] **Multi-language Support**: i18n implementation

### 🔧 Phase 6: Infrastructure & DevOps (🔄 Ongoing)
- [ ] **Kubernetes**: Container orchestration
- [ ] **Microservices**: Break into services (Auth, Game, Trading)
- [ ] **Message Queue**: Kafka/RabbitMQ for event processing
- [ ] **CDN Integration**: CloudFlare or AWS CloudFront
- [ ] **Monitoring**: Grafana, Prometheus, OpenTelemetry
- [ ] **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- [ ] **CI/CD Pipeline**: Automated testing & deployment

---

## 💻 Cài đặt & Chạy dự án

### Yêu cầu hệ thống

- **.NET 8 SDK** ([Download](https://dotnet.microsoft.com/download/dotnet/8.0))
- **Node.js 20+** & **npm/yarn** ([Download](https://nodejs.org/))
- **PostgreSQL** (hoặc Supabase account)
- **Docker & Docker Compose** (optional, recommended)
- **Git**

### 🐳 Cách 1: Chạy với Docker (Recommended)

```bash
# 1. Clone repository
git clone https://github.com/AnPhuoc2410/Kiremon.git
cd Kiremon

# 2. Tạo file .env từ template
cp env.production.example .env

# 3. Cấu hình .env
nano .env  # Hoặc dùng text editor bất kỳ

# 4. Build & Run với Docker Compose
docker-compose -f docker-compose.dev.yml up --build

# API sẽ chạy tại: http://localhost:5000
# Frontend dev server: http://localhost:5173
```

### 🛠 Cách 2: Chạy Manual (Development)

#### Backend Setup

```bash
# 1. Navigate to server project
cd PokedexReactASP.Server

# 2. Restore dependencies
dotnet restore

# 3. Update appsettings.Development.json
# Điền connection string, JWT settings, Email settings,...

# 4. Apply migrations
dotnet ef database update

# 5. Run backend
dotnet run
# API: https://localhost:7028
```

#### Frontend Setup

```bash
# 1. Navigate to client project
cd pokedexreactasp.client

# 2. Install 

**✅ Phase 1 - Completed:** Pokemon catching, IV/Nature, Shiny, Pokédex, Authentication

**🔄 Phase 2 - In Progress:** Battle System, Evolution, Trading, Breeding, Achievements, Leaderboard

**📋 Phase 3 - Planned:** Friend System, PvP Battles, Guild, Chat, Marketplace, Tournaments

**💡 Future:** PWA, Mobile App, Events, Weather System, Analytics, Microservices
      "ClientId": "your-microsoft-client-id",
      "ClientSecret": "your-microsoft-client-secret"
    }
  },
  "RecaptchaSettings": {
    "SiteKey": "your-recaptcha-site-key",
    "SecretKey": "your-recaptcha-secret-key"
  }
}
```

#### Frontend: `.env.local`

```env
VITE_API_URL=https://localhost:7028
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_FACEBOOK_APP_ID=your-facebook-app-id
VITE_MICROSOFT_CLIENT_ID=your-microsoft-client-id
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

---

## 🚢 Deployment

### Frontend Deployment (Vercel)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Navigate to frontend folder
cd pokedexreactasp.client

# 3. Deploy
vercel --prod

# 4. Configure environment variables trong Vercel Dashboard
# VITE_API_URL=https://your-api-domain.com
```

### Backend Deployment (VPS)

Xem hướng dẫn chi tiết tại [DEPLOYMENT.md](./DEPLOYMENT.md)


**Yêu cầu:** .NET 8 SDK, Node.js 20+, PostgreSQL/Supabase, Docker (optional)

### 🐳 Docker (Recommended)

```bash
git clone https://github.com/AnPhuoc2410/Kiremon.git && cd Kiremon
cp env.production.example .env && nano .env
docker-compose -f docker-compose.dev.yml up --build
```

## 🎯 Những điểm nổi bật

**Architecture & Design**
- Clean Architecture với SOLID principles
- Repository & Service Layer patterns
- Dependency Injection throughout
- Type Safety (TypeScript + C#)

**Security**
- Multi-layer defense (JWT, 2FA, reCAPTCHA, Rate Limiting)
- OAuth2 chuẩn OpenID Connect
- HTTPS/TLS, CSRF protection, SQL Injection prevention

**Performance**
- Caching strategy (In-Memory, Redis-ready)
- Database indexing & connection pooling
- Frontend optimization (Code splitting, lazy loading)

**DevOps**
- Docker containerization
- Health checks & monitoring ready
- Environment-based configuration

---

## 📚 Bài học kinh nghiệm

**Technical Skills:**
- Clean Architecture implementation thực tế
- JWT + OAuth2 + 2FA authentication flows
- EF Core relationships & migrations
- SignalR real-time communication
- React 19 + TypeScript best practices
- Docker & VPS deployment

**Challenges Solved:**
- PokeAPI data complexity → DTOs + caching
- Multi-provider auth → ASP.NET Identity + external login mapping
- SignalR scaling → Connection tracking + Redis backplane ready
- Environment consistency → Docker containerization

**What I'd Do Differently:**
- Write tests from the start
- More time on initial database design
- Setup logging & monitoring earlier
- API versioning from day 1📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 📞 Contact

**Phuoc An** - Fullstack Developer

📧 [an.phuoc2410@gmail.com](mailto:an.phuoc2410@gmail.com) • 🐙 [@AnPhuoc2410](https://github.com/AnPhuoc2410)

🔗 [Repository](https://github.com/AnPhuoc2410/Kiremon) • 🎮 [Live Demo](https://kiremon.vercel.app)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Phuoc An](https://github.com/AnPhuoc2410)