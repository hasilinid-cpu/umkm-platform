# 🚀 PANDUAN DEPLOY GRATIS — UMKM Penggerak Indonesia

> **Frontend** → Vercel (gratis) | **Backend** → Render.com (gratis) | **Database** → Neon (PostgreSQL gratis)

---

## 📋 DAFTAR ISI

1. [Persiapan Awal](#1-persiapan-awal)
2. [Deploy Database — Neon PostgreSQL](#2-deploy-database--neon-postgresql-gratis)
3. [Deploy Backend — Render.com](#3-deploy-backend--rendercom-gratis)
4. [Deploy Frontend — Vercel](#4-deploy-frontend--vercel-gratis)
5. [Integrasi Google Analytics](#5-integrasi-google-analytics)
6. [Custom Domain (Opsional)](#6-custom-domain-opsional)
7. [Checklist Final](#7-checklist-final)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. PERSIAPAN AWAL

### Yang Dibutuhkan (Semua Gratis):
- [ ] Akun **GitHub** → github.com
- [ ] Akun **Vercel** → vercel.com (daftar pakai GitHub)
- [ ] Akun **Render** → render.com (daftar pakai GitHub)
- [ ] Akun **Neon** → neon.tech (daftar pakai GitHub)
- [ ] Akun **Google Analytics** → analytics.google.com

### Upload Kode ke GitHub:

```bash
# 1. Install Git jika belum ada
# Windows: download dari git-scm.com
# Mac: brew install git

# 2. Buat repository baru di github.com
# Klik "New Repository" → nama: umkm-platform → Create

# 3. Upload kode
cd /path/ke/umkm-platform
git init
git add .
git commit -m "Initial commit: UMKM Penggerak Indonesia"
git branch -M main
git remote add origin https://github.com/USERNAME/umkm-platform.git
git push -u origin main
```

---

## 2. DEPLOY DATABASE — Neon PostgreSQL (GRATIS)

### Langkah-langkah:

1. **Buka** → https://neon.tech dan klik **"Sign Up"**
2. **Login** dengan akun GitHub
3. Klik **"Create a project"**
4. Isi:
   - **Project name**: `umkm-platform`
   - **Database name**: `umkm_platform`
   - **Region**: `Asia Pacific (Singapore)` ← pilih ini agar cepat dari Indonesia
5. Klik **"Create project"**
6. **Salin Connection String** yang diberikan, contoh:
   ```
   postgresql://username:password@ep-xxx.ap-southeast-1.aws.neon.tech/umkm_platform?sslmode=require
   ```
7. **Simpan** string ini, akan dipakai di backend

### Batas Gratis Neon:
- ✅ 500 MB storage
- ✅ 1 database
- ✅ Serverless auto-pause (hemat resource)
- ✅ Cukup untuk ratusan ribu record

---

## 3. DEPLOY BACKEND — Render.com (GRATIS)

### Langkah-langkah:

1. **Buka** → https://render.com dan klik **"Get Started for Free"**
2. **Login** dengan akun GitHub
3. Klik **"New +"** → pilih **"Web Service"**
4. Klik **"Connect a repository"** → pilih repo `umkm-platform`
5. Isi konfigurasi:

| Field | Value |
|-------|-------|
| **Name** | `umkm-platform-api` |
| **Region** | `Singapore` |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

6. Klik **"Advanced"** → tambahkan **Environment Variables**:

```
NODE_ENV=production
PORT=10000
DB_HOST=         (dari Neon — bagian host)
DB_PORT=5432
DB_NAME=umkm_platform
DB_USER=         (dari Neon — username)
DB_PASSWORD=     (dari Neon — password)
JWT_SECRET=umkm_super_secret_ganti_ini_2024_aman
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=umkm_refresh_secret_ganti_2024
JWT_REFRESH_EXPIRES_IN=30d
APP_URL=https://umkmpengerak.vercel.app
DATABASE_URL=    (paste full connection string dari Neon)
```

> ⚠️ **Ganti JWT_SECRET** dengan string acak panjang! Gunakan: https://randomkeygen.com

7. Klik **"Create Web Service"**
8. Tunggu build selesai (~3-5 menit)
9. **Salin URL backend** Anda, contoh: `https://umkm-platform-api.onrender.com`

### Jalankan Seeder (Isi Data Dummy):

Setelah deploy berhasil, buka **Shell** di Render:
```bash
# Di dashboard Render → Service → Shell tab
npm run seed
```

### Batas Gratis Render:
- ✅ 750 jam/bulan (cukup untuk 1 service 24/7)
- ⚠️ Service tidur setelah 15 menit tidak aktif (wake-up ~30 detik)
- 💡 **Solusi**: Gunakan UptimeRobot (gratis) untuk ping setiap 10 menit

#### Setup UptimeRobot (Cegah Sleep):
1. Buka https://uptimerobot.com → daftar gratis
2. **Add New Monitor**:
   - Type: `HTTP(s)`
   - URL: `https://umkm-platform-api.onrender.com/health`
   - Interval: `10 minutes`
3. Klik **Create Monitor** ✅

---

## 4. DEPLOY FRONTEND — Vercel (GRATIS)

### Langkah-langkah:

1. **Buka** → https://vercel.com dan klik **"Start Deploying"**
2. **Login** dengan akun GitHub
3. Klik **"Add New Project"** → **"Import Git Repository"**
4. Pilih repo `umkm-platform`
5. Konfigurasi:

| Field | Value |
|-------|-------|
| **Framework Preset** | `Next.js` |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |

6. Klik **"Environment Variables"** dan tambahkan:

```
NEXT_PUBLIC_API_URL=https://umkm-platform-api.onrender.com/api
NEXT_PUBLIC_APP_NAME=UMKM Penggerak Indonesia
NEXT_PUBLIC_APP_URL=https://umkmpengerak.vercel.app
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code
```

> Ganti `G-XXXXXXXXXX` setelah setup Google Analytics di langkah 5

7. Klik **"Deploy"**
8. Tunggu ~2-3 menit
9. Website Anda live di: `https://umkmpengerak.vercel.app` 🎉

### Auto-Deploy:
Setiap kali Anda push ke GitHub → Vercel otomatis rebuild dan deploy ulang ✅

### Batas Gratis Vercel:
- ✅ Bandwidth 100 GB/bulan
- ✅ Serverless Functions
- ✅ CDN global (termasuk Asia)
- ✅ SSL otomatis (HTTPS)
- ✅ Preview deployment per branch

---

## 5. INTEGRASI GOOGLE ANALYTICS

### A. Buat Property GA4:

1. Buka → https://analytics.google.com
2. Klik **"Start measuring"** atau **"Admin"** → **"Create Property"**
3. Isi:
   - **Property name**: `UMKM Penggerak Indonesia`
   - **Reporting time zone**: `Indonesia (WIB)`
   - **Currency**: `Indonesian Rupiah (IDR)`
4. Klik **"Next"** → pilih **"Web"**
5. Isi:
   - **Website URL**: `https://umkmpengerak.vercel.app`
   - **Stream name**: `UMKM Platform Web`
6. Klik **"Create stream"**
7. **Salin Measurement ID**: `G-XXXXXXXXXX`

### B. Pasang di Vercel:

1. Buka Vercel → project Anda → **Settings** → **Environment Variables**
2. Edit `NEXT_PUBLIC_GA_MEASUREMENT_ID`
3. Isi nilai: `G-XXXXXXXXXX` (ID Anda)
4. Klik **"Save"**
5. Redeploy: **Deployments** → klik titik tiga → **"Redeploy"**

### C. Verifikasi Google Search Console (SEO):

1. Buka → https://search.google.com/search-console
2. Klik **"Add property"** → masukkan URL website Anda
3. Pilih metode verifikasi **"HTML tag"**
4. Salin content verification code, contoh: `abc123xyz`
5. Di Vercel, tambahkan env var:
   ```
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123xyz
   ```
6. Redeploy

### D. Event Tracking yang Sudah Terpasang:

Platform ini sudah tracking otomatis:

| Event | Trigger |
|-------|---------|
| `page_view` | Setiap pindah halaman |
| `sign_up` | Registrasi akun baru |
| `login` | User masuk |
| `view_item` | Lihat kursus/produk |
| `add_to_cart` | Klik daftar/beli |
| `purchase` | Pembayaran berhasil |
| `search` | Pencarian konten |
| `subscribe` | Upgrade ke Premium |
| `complete_course` | Kursus diselesaikan |
| `book_session` | Booking mentor |

### E. Dashboard GA yang Direkomendasikan:

Buat report custom di GA4:
- **Akuisisi**: Dari mana user datang (organic, direct, referral)
- **Konversi**: Registrasi → Aktif → Premium
- **Engagement**: Kursus paling populer, halaman terlama dilihat
- **Revenue**: Total transaksi, ARPU (average revenue per user)

---

## 6. CUSTOM DOMAIN (OPSIONAL)

Jika ingin domain sendiri seperti `umkmpengerak.id`:

### Beli Domain:
- **Niagahoster**: ~Rp 15.000/tahun untuk .id
- **Domainesia**: ~Rp 12.000/tahun untuk .id
- **Namecheap**: ~$10/tahun untuk .com

### Pasang ke Vercel:

1. Vercel → project → **Settings** → **Domains**
2. Klik **"Add"** → ketik domain Anda
3. Vercel akan memberikan DNS records:
   ```
   Type: A      Name: @      Value: 76.76.21.21
   Type: CNAME  Name: www    Value: cname.vercel-dns.com
   ```
4. Buka panel domain Anda → DNS Management
5. Tambahkan records tersebut
6. Tunggu propagasi DNS (15 menit - 48 jam)
7. Vercel otomatis pasang SSL gratis ✅

### Update CORS Backend (Render):

Tambahkan env var di Render:
```
APP_URL=https://umkmpengerak.id
```

---

## 7. CHECKLIST FINAL ✅

Sebelum launch, pastikan semua sudah dilakukan:

### Backend:
- [ ] Environment variables sudah diisi semua
- [ ] Database Neon terkoneksi
- [ ] Health check `/health` response OK
- [ ] Seeder dijalankan (`npm run seed`)
- [ ] UptimeRobot sudah setup

### Frontend:
- [ ] `NEXT_PUBLIC_API_URL` mengarah ke Render
- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` sudah diisi
- [ ] Build berhasil tanpa error
- [ ] Test register & login berfungsi
- [ ] Test beli kursus berfungsi (mock payment)

### Google Analytics:
- [ ] Measurement ID terpasang
- [ ] Pageview tracking aktif (cek Realtime di GA)
- [ ] Google Search Console terverifikasi

### Keamanan:
- [ ] `JWT_SECRET` sudah diganti (bukan default)
- [ ] Password database kuat
- [ ] CORS hanya allow domain Anda

---

## 8. TROUBLESHOOTING

### ❌ Backend Error: "Cannot connect to database"
**Solusi**: Periksa `DATABASE_URL` di Render. Harus include `?sslmode=require` di akhir URL Neon.

### ❌ Frontend Error: "CORS blocked"
**Solusi**: Di backend Render, pastikan `APP_URL` sesuai dengan URL Vercel Anda (tanpa slash di akhir).

### ❌ Render Service Tidur
**Solusi**: Setup UptimeRobot seperti di langkah 3. Atau upgrade ke Render Starter ($7/bulan).

### ❌ Google Analytics tidak tracking
**Solusi**:
1. Pastikan `NEXT_PUBLIC_GA_MEASUREMENT_ID` diisi dengan benar (bukan `G-XXXXXXXXXX`)
2. Redeploy frontend setelah update env var
3. Cek Realtime report di GA — buka website, lihat apakah muncul

### ❌ Build Vercel gagal
**Solusi**:
```bash
# Test build lokal dulu:
cd frontend
npm install
npm run build
# Jika ada error, perbaiki dulu sebelum push
```

### ❌ Seed gagal di Render
**Solusi**: Jalankan di Shell Render:
```bash
cd backend && npm run seed
```
Jika error "relation already exists", tambahkan di seeder `force: true` sementara.

---

## 💡 TIPS OPTIMASI PERFORMA

### Speed Frontend (Vercel):
- Gambar → gunakan `next/image` dengan format WebP
- Font → sudah menggunakan `display: 'swap'`
- Bundle → Next.js otomatis code-splitting

### Speed Backend (Render):
- Aktifkan connection pooling di Neon
- Tambahkan index di kolom yang sering di-query:
```sql
CREATE INDEX idx_courses_category ON "Courses"(category);
CREATE INDEX idx_enrollments_user ON "Enrollments"("userId");
CREATE INDEX idx_posts_category ON "Posts"(category);
```

### SEO untuk UMKM:
- Isi meta description setiap halaman
- Buat sitemap.xml (tambahkan di `next.config.js`)
- Pastikan halaman load < 3 detik
- Tambahkan schema markup untuk Course (rich snippet)

---

## 📊 STACK RINGKASAN

```
┌─────────────────────────────────────┐
│          UMKM Penggerak Indonesia   │
├─────────────┬───────────────────────┤
│  FRONTEND   │  Next.js 14 + Tailwind │
│  HOST       │  Vercel (FREE)         │
│  URL        │  umkmpengerak.vercel   │
├─────────────┼───────────────────────┤
│  BACKEND    │  Node.js + Express     │
│  HOST       │  Render.com (FREE)     │
│  URL        │  umkm-api.onrender.com │
├─────────────┼───────────────────────┤
│  DATABASE   │  PostgreSQL + Sequelize│
│  HOST       │  Neon.tech (FREE)      │
│  SIZE       │  500 MB gratis         │
├─────────────┼───────────────────────┤
│  ANALYTICS  │  Google Analytics 4    │
│  MONITORING │  UptimeRobot (FREE)    │
└─────────────┴───────────────────────┘

TOTAL BIAYA BULANAN: Rp 0 🎉
(sampai traffic sangat besar)
```

---

## 🆙 UPGRADE SAAT TRAFFIC BESAR

Saat website sudah ramai, upgrade ke:

| Service | Gratis → Berbayar | Harga |
|---------|-------------------|-------|
| Render | Free → Starter | $7/bulan |
| Vercel | Hobby → Pro | $20/bulan |
| Neon | Free → Launch | $19/bulan |
| Domain .id | - | ~Rp 15.000/tahun |

**Total upgrade: ~$46/bulan (~Rp 720.000)** untuk ribuan user aktif.

---

*Dibuat untuk: UMKM Penggerak Indonesia*
*Platform: umkmpengerak.id*
*Tagline: "UMKM Kuat, Indonesia Maju" 🇮🇩*
