# 🇮🇩 UMKM Penggerak Indonesia
### *"UMKM Kuat, Indonesia Maju"*

Platform ekosistem digital terpadu untuk pelatihan, pengembangan, komunitas, dan monetisasi UMKM di Indonesia.

---

## 🚀 Cara Menjalankan Lokal

### Prasyarat:
- Node.js >= 18
- PostgreSQL (atau pakai Neon.tech gratis)
- Git

### 1. Clone & Setup:
```bash
git clone https://github.com/USERNAME/umkm-platform.git
cd umkm-platform
```

### 2. Setup Backend:
```bash
cd backend
cp .env.example .env
# Edit .env dengan konfigurasi database Anda

npm install
npm run seed   # isi data dummy
npm run dev    # jalankan di http://localhost:5000
```

### 3. Setup Frontend:
```bash
cd frontend
cp .env.example .env.local
# Edit NEXT_PUBLIC_API_URL=http://localhost:5000/api

npm install
npm run dev    # jalankan di http://localhost:3000
```

### 4. Akun Demo:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@umkmpengerak.id | Admin123! |
| Premium | andi@example.com | Andi123! |
| Free | siti@example.com | Siti123! |

---

## 🏗️ Arsitektur

```
umkm-platform/
├── backend/                 # Node.js + Express API
│   └── src/
│       ├── config/          # Database config
│       ├── controllers/     # Business logic
│       ├── middleware/       # Auth JWT, rate limit
│       ├── models/          # Sequelize ORM models
│       ├── routes/          # API routes
│       └── utils/           # Helpers & seeder
│
├── frontend/                # Next.js 14 App Router
│   └── src/
│       ├── app/             # Pages (App Router)
│       │   ├── page.tsx         # Homepage
│       │   ├── login/           # Auth pages
│       │   ├── register/
│       │   ├── akademi/         # Course listing + detail
│       │   ├── modul/           # Marketplace
│       │   ├── komunitas/       # Forum
│       │   ├── mentor/          # Mentoring booking
│       │   ├── relearning/      # Re-Learning library
│       │   ├── dashboard/       # User dashboard
│       │   └── admin/           # Admin panel
│       ├── components/
│       │   ├── analytics/       # Google Analytics
│       │   ├── layout/          # Navbar, Footer, Sidebar
│       │   └── providers/       # Auth, Query providers
│       ├── lib/             # API client (axios)
│       └── store/           # Zustand state
│
└── PANDUAN_DEPLOY.md        # Panduan deploy gratis
```

## 🎯 Fitur Utama

| Fitur | Status |
|-------|--------|
| ✅ Authentication (JWT) | Done |
| ✅ Homepage Landing Page | Done |
| ✅ Akademi UMKM (Kursus) | Done |
| ✅ Re-Learning Library | Done |
| ✅ Modul Bisnis (Marketplace) | Done |
| ✅ Komunitas Forum | Done |
| ✅ Klinik Bisnis (Mentoring) | Done |
| ✅ Membership Premium | Done |
| ✅ User Dashboard | Done |
| ✅ Admin Dashboard | Done |
| ✅ Notifikasi System | Done |
| ✅ Payment (Mock) | Done |
| ✅ Google Analytics | Done |
| ✅ Responsive Mobile | Done |

## 📡 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
GET    /api/courses
GET    /api/courses/:slug
POST   /api/courses/:id/enroll
GET    /api/products
GET    /api/community/posts
POST   /api/community/posts
GET    /api/mentors
POST   /api/bookings
POST   /api/payments/create
POST   /api/payments/confirm/:id
GET    /api/notifications
GET    /api/admin/stats         (admin only)
GET    /api/admin/users         (admin only)
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Zustand, React Query
- **Backend**: Node.js, Express.js, Sequelize ORM
- **Database**: PostgreSQL
- **Auth**: JWT (Access + Refresh Token)
- **Analytics**: Google Analytics 4
- **Deploy**: Vercel + Render + Neon (semua gratis)
