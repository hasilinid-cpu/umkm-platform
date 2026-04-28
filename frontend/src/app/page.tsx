'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';

const stats = [
  { value: '50,000+', label: 'UMKM Terdaftar' },
  { value: '200+', label: 'Kursus Tersedia' },
  { value: '50+', label: 'Mentor Expert' },
  { value: '98%', label: 'Tingkat Kepuasan' },
];

const features = [
  {
    icon: '🎓',
    title: 'Akademi UMKM',
    desc: 'Kursus video berkualitas tinggi dari mentor berpengalaman. Belajar marketing, keuangan, operasional, dan lebih banyak lagi.',
    href: '/akademi',
    color: 'from-blue-500 to-blue-600',
    badge: '200+ Kursus',
  },
  {
    icon: '🔄',
    title: 'Re-Learning',
    desc: 'Akses kembali materi yang pernah dipelajari kapan saja. Library video rekaman dan PDF yang bisa diunduh.',
    href: '/relearning',
    color: 'from-purple-500 to-purple-600',
    badge: 'Akses Seumur Hidup',
  },
  {
    icon: '📦',
    title: 'Modul Bisnis',
    desc: 'Marketplace template bisnis, SOP, dan tools Excel siap pakai. Percepat pengelolaan bisnis Anda.',
    href: '/modul',
    color: 'from-orange-500 to-orange-600',
    badge: '500+ Produk',
  },
  {
    icon: '👥',
    title: 'Komunitas',
    desc: 'Forum diskusi aktif antar sesama UMKM. Berbagi pengalaman, tanya jawab, dan jalin koneksi bisnis.',
    href: '/komunitas',
    color: 'from-green-500 to-green-600',
    badge: '10,000+ Member',
  },
  {
    icon: '🩺',
    title: 'Klinik Bisnis',
    desc: 'Sesi konsultasi 1-on-1 langsung dengan mentor dan pakar bisnis berpengalaman. Selesaikan masalah bisnis Anda.',
    href: '/mentor',
    color: 'from-teal-500 to-teal-600',
    badge: '50+ Mentor',
  },
  {
    icon: '🏆',
    title: 'Sertifikasi',
    desc: 'Dapatkan sertifikat resmi setelah menyelesaikan kursus. Tingkatkan kredibilitas dan kepercayaan pelanggan.',
    href: '/akademi',
    color: 'from-amber-500 to-amber-600',
    badge: 'Sertifikat Resmi',
  },
];

const testimonials = [
  {
    name: 'Siti Rahayu',
    business: 'Warung Siti Kuliner, Jakarta',
    text: 'Berkat UMKM Penggerak, omzet warung saya naik 150% dalam 3 bulan. Kursus digital marketingnya sangat praktis!',
    avatar: 'S',
    rating: 5,
  },
  {
    name: 'Budi Firmansyah',
    business: 'Batik Budi Craft, Yogyakarta',
    text: 'Template bisnis plan dan modul Excel-nya luar biasa. Saya bisa dapat pendanaan KUR setelah menggunakan tools ini.',
    avatar: 'B',
    rating: 5,
  },
  {
    name: 'Rina Kusuma',
    business: 'Rins Fashion, Surabaya',
    text: 'Komunitas UMKM-nya aktif banget. Banyak ilmu yang saya dapat dari sesama pebisnis. Highly recommended!',
    avatar: 'R',
    rating: 5,
  },
];

const pricing = [
  {
    name: 'Gratis',
    price: 0,
    period: 'Selamanya',
    description: 'Mulai perjalanan belajar Anda',
    features: [
      '10 kursus gratis pilihan',
      'Akses komunitas dasar',
      '5 template bisnis gratis',
      'Materi pembelajaran terbatas',
      '1 sesi konsultasi gratis',
    ],
    limitations: ['Tidak ada sertifikat', 'Tanpa akses Re-Learning'],
    cta: 'Mulai Gratis',
    href: '/register',
    popular: false,
    color: 'border-slate-200',
  },
  {
    name: 'Premium',
    price: 59000,
    period: 'per bulan',
    annualPrice: 49000,
    description: 'Semua yang Anda butuhkan untuk bisnis berkembang',
    features: [
      'Semua kursus tanpa batas',
      'Akses penuh Re-Learning',
      'Semua template & modul bisnis',
      'Komunitas Premium eksklusif',
      'Sertifikat semua kursus',
      'Diskon 20% sesi konsultasi',
      'Download materi PDF unlimited',
      'Early access konten baru',
    ],
    limitations: [],
    cta: 'Mulai 7 Hari Gratis',
    href: '/register?plan=premium',
    popular: true,
    color: 'border-orange-400',
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();
  const [annualBilling, setAnnualBilling] = useState(false);
  const [counter, setCounter] = useState({ umkm: 0, kursus: 0, mentor: 0 });

  useEffect(() => {
    const targets = { umkm: 50000, kursus: 200, mentor: 50 };
    const duration = 2000;
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounter({
        umkm: Math.floor(targets.umkm * ease),
        kursus: Math.floor(targets.kursus * ease),
        mentor: Math.floor(targets.mentor * ease),
      });
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ====== HERO ====== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background elements */}
        <div className="absolute inset-0 batik-pattern opacity-30" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              Platform #1 untuk UMKM Indonesia
            </div>

            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              <span className="block">UMKM Kuat,</span>
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                Indonesia Maju
              </span>
            </h1>

            <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
              Ekosistem digital terpadu untuk pelatihan, pengembangan, komunitas, dan monetisasi UMKM Indonesia. Dari pemula hingga ekspor!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href={isAuthenticated ? '/dashboard' : '/register'}
                className="btn-primary text-base py-4 px-8 shadow-glow">
                🚀 {isAuthenticated ? 'Ke Dashboard' : 'Mulai Belajar Gratis'}
              </Link>
              <Link href="/akademi" className="btn-secondary text-base py-4 px-8 bg-white/10 border-white/20 text-white hover:bg-white/20">
                📚 Lihat Kursus
              </Link>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-white font-display">{counter.umkm.toLocaleString()}+</div>
                <div className="text-slate-400 text-xs mt-0.5">UMKM Terdaftar</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-display">{counter.kursus}+</div>
                <div className="text-slate-400 text-xs mt-0.5">Kursus Aktif</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white font-display">{counter.mentor}+</div>
                <div className="text-slate-400 text-xs mt-0.5">Mentor Expert</div>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden lg:block animate-float">
            <div className="relative">
              {/* Main card */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-2xl">🎓</div>
                  <div>
                    <div className="text-white font-semibold font-display">Digital Marketing untuk UMKM</div>
                    <div className="text-slate-400 text-sm">Budi Santoso • 12 Video</div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  {['Strategi Instagram Marketing', 'Facebook & Meta Ads', 'Google My Business', 'Email Marketing'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${i < 2 ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-slate-500'}`}>
                        {i < 2 ? '✓' : String(i + 1)}
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
                <div className="bg-white/5 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <div className="text-slate-400 text-xs">Progress Belajar</div>
                    <div className="text-white font-semibold text-sm mt-0.5">65% selesai</div>
                  </div>
                  <div className="w-16 h-16 relative">
                    <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#374151" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EA580C" strokeWidth="3"
                        strokeDasharray={`${65 * 100 / 100} 100`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">65%</span>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg animate-bounce-slow">
                ⭐ 4.9 Rating
              </div>
              <div className="absolute -bottom-4 -left-4 bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg">
                🏆 Sertifikat Resmi
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== STATS ====== */}
      <section className="bg-white border-b border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-600 font-display">{stat.value}</div>
                <div className="text-slate-500 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURES ====== */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block badge bg-orange-100 text-orange-700 mb-4">🌟 Fitur Platform</div>
            <h2 className="section-title">Semua yang UMKM Butuhkan,<br /><span className="gradient-text">Satu Platform</span></h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Dari belajar hingga konsultasi, dari komunitas hingga marketplace — kami hadir untuk mendukung pertumbuhan bisnis Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Link key={i} href={feature.href}
                className="card card-hover p-7 group cursor-pointer">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-2xl mb-5 shadow-md group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-lg font-display">{feature.title}</h3>
                  <span className="badge bg-slate-100 text-slate-600 text-xs ml-2 flex-shrink-0">{feature.badge}</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                <div className="mt-5 flex items-center text-orange-600 text-sm font-semibold group-hover:gap-3 gap-1.5 transition-all">
                  Jelajahi <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Cara Mulai di<br /><span className="gradient-text">UMKM Penggerak</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: '📝', title: 'Daftar Gratis', desc: 'Buat akun dalam 2 menit. Tidak perlu kartu kredit.' },
              { step: '02', icon: '🎯', title: 'Pilih Kursus', desc: 'Pilih dari 200+ kursus sesuai kebutuhan bisnis Anda.' },
              { step: '03', icon: '📖', title: 'Belajar & Praktik', desc: 'Ikuti materi video, download PDF, dan diskusi komunitas.' },
              { step: '04', icon: '🚀', title: 'Kembangkan Bisnis', desc: 'Terapkan ilmu dan saksikan bisnis Anda bertumbuh pesat.' },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-orange-300 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-orange-50 border-2 border-orange-200 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    {item.icon}
                  </div>
                  <div className="text-orange-500 font-bold text-sm mb-1">{item.step}</div>
                  <h3 className="font-bold text-slate-900 mb-2 font-display">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title text-white">Kisah Sukses<br /><span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">UMKM Bersama Kami</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur border border-white/10 rounded-2xl p-7 hover:bg-white/15 transition-all">
                <div className="flex gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => <span key={j} className="text-amber-400">⭐</span>)}
                </div>
                <p className="text-slate-200 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.business}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PRICING ====== */}
      <section className="py-24 bg-white" id="pricing">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title">Pilih Paket yang<br /><span className="gradient-text">Sesuai Kebutuhan</span></h2>
            <p className="section-subtitle">Mulai gratis, upgrade kapan saja</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className={`text-sm font-medium ${!annualBilling ? 'text-slate-900' : 'text-slate-400'}`}>Bulanan</span>
              <button onClick={() => setAnnualBilling(!annualBilling)}
                className={`relative w-12 h-6 rounded-full transition-all ${annualBilling ? 'bg-orange-600' : 'bg-slate-200'}`}>
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${annualBilling ? 'left-7' : 'left-1'}`} />
              </button>
              <span className={`text-sm font-medium ${annualBilling ? 'text-slate-900' : 'text-slate-400'}`}>
                Tahunan <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">Hemat 17%</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pricing.map((plan, i) => (
              <div key={i} className={`card p-8 border-2 ${plan.color} relative ${plan.popular ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-orange-500 text-white text-xs font-bold px-6 py-1.5 rounded-full shadow-lg">
                    ✨ Paling Populer
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 font-display mb-1">{plan.name}</h3>
                  <p className="text-slate-500 text-sm">{plan.description}</p>
                </div>
                <div className="mb-8">
                  {plan.price === 0 ? (
                    <div className="text-4xl font-bold text-slate-900 font-display">Gratis</div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-slate-900 font-display">
                        Rp {(annualBilling ? (plan.annualPrice || plan.price) : plan.price).toLocaleString('id')}
                      </span>
                      <span className="text-slate-400 text-sm">{plan.period}</span>
                    </div>
                  )}
                  {plan.price > 0 && annualBilling && (
                    <p className="text-sm text-green-600 mt-1 font-medium">Hemat Rp {((plan.price - (plan.annualPrice || 0)) * 12).toLocaleString('id')}/tahun</p>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span> {f}
                    </li>
                  ))}
                  {plan.limitations.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm text-slate-400">
                      <span className="text-slate-300 mt-0.5 flex-shrink-0">✗</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}
                  className={`block text-center py-3.5 px-6 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-glow hover:shadow-glow-lg'
                      : 'border-2 border-slate-200 hover:border-orange-400 text-slate-700 hover:text-orange-600'
                  }`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== CTA BANNER ====== */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-700 relative overflow-hidden">
        <div className="absolute inset-0 batik-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4 font-display">
            Siap Membawa UMKM Anda ke Level Berikutnya?
          </h2>
          <p className="text-orange-100 text-lg mb-8">Bergabunglah bersama 50,000+ UMKM yang sudah merasakan manfaatnya.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-white text-orange-600 font-bold py-4 px-10 rounded-xl hover:bg-orange-50 transition-all shadow-lg text-base">
              🚀 Daftar Sekarang — Gratis!
            </Link>
            <Link href="/akademi" className="border-2 border-white/50 text-white font-bold py-4 px-10 rounded-xl hover:bg-white/10 transition-all text-base">
              Lihat Semua Kursus
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
