'use client';
import { useQuery } from 'react-query';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { courseAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

const MATERIALS = [
  { id: 1, title: 'Template Laporan Keuangan Bulanan', type: 'PDF', size: '2.4 MB', category: 'Keuangan', isPremium: false, icon: '📊' },
  { id: 2, title: 'Panduan Instagram Marketing 2024', type: 'PDF', size: '5.1 MB', category: 'Marketing', isPremium: false, icon: '📱' },
  { id: 3, title: 'SOP Standar Operasional UMKM', type: 'PDF', size: '3.8 MB', category: 'Operasional', isPremium: true, icon: '📋' },
  { id: 4, title: 'Modul Ekspor Produk ke ASEAN', type: 'PDF', size: '7.2 MB', category: 'Ekspor', isPremium: true, icon: '🌏' },
  { id: 5, title: 'Checklist Persiapan Pameran UMKM', type: 'PDF', size: '1.2 MB', category: 'Pemasaran', isPremium: false, icon: '✅' },
  { id: 6, title: 'Template Pitch Deck Investor', type: 'PDF', size: '4.5 MB', category: 'Bisnis', isPremium: true, icon: '🎯' },
];

export default function ReLearningPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const isPremium = user?.membership === 'premium';

  const { data } = useQuery('my-courses', () =>
    courseAPI.getMyCourses().then(r => r.data.data.enrollments),
    { enabled: isAuthenticated }
  );
  const enrollments = data || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 via-slate-900 to-slate-800 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block badge bg-purple-500/20 border border-purple-500/30 text-purple-300 mb-4">🔄 Re-Learning</div>
          <h1 className="text-4xl font-bold text-white font-display mb-3">
            Akses Ulang Materi <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Kapan Saja</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Library video rekaman dan materi PDF yang bisa diunduh. Belajar ulang tanpa batas.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {!isAuthenticated ? (
          /* Not logged in */
          <div className="text-center py-20 card max-w-lg mx-auto">
            <div className="text-6xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Login untuk Akses Re-Learning</h3>
            <p className="text-slate-500 mb-6">Masuk ke akun Anda untuk mengakses semua materi pembelajaran</p>
            <div className="flex gap-3 justify-center">
              <Link href="/login" className="btn-primary">Masuk Sekarang</Link>
              <Link href="/register" className="btn-secondary">Daftar Gratis</Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main: Video Rekaman */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 font-display">🎬 Video Rekaman Kursus Saya</h2>
                <span className="text-slate-500 text-sm">{enrollments.length} kursus</span>
              </div>

              {enrollments.length === 0 ? (
                <div className="card p-12 text-center">
                  <div className="text-5xl mb-4">📭</div>
                  <h3 className="font-bold text-slate-800 mb-2">Belum ada video tersimpan</h3>
                  <p className="text-slate-500 text-sm mb-5">Daftar kursus dulu untuk bisa mengakses video rekaman</p>
                  <Link href="/akademi" className="btn-primary">Jelajahi Kursus</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrollments.map((enrollment: any) => (
                    <div key={enrollment.id} className="card p-5 hover:shadow-card-hover transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🎬</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 font-display text-sm mb-1 line-clamp-2">{enrollment.course?.title}</h3>
                          <p className="text-slate-400 text-xs capitalize mb-2">{enrollment.course?.category} • {enrollment.course?.totalLessons} video</p>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${enrollment.progress || 0}%` }} />
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span>Progress: {enrollment.progress || 0}%</span>
                            <span>{enrollment.completedLessons?.length || 0}/{enrollment.course?.totalLessons} selesai</span>
                          </div>
                        </div>
                        <Link href={`/akademi/${enrollment.course?.slug}`}
                          className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all">
                          ▶ Buka
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar: PDF Materials */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 font-display">📥 Download Materi PDF</h2>
              </div>

              {!isPremium && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5">
                  <div className="text-2xl mb-2">⭐</div>
                  <h3 className="font-bold text-slate-900 mb-1">Upgrade Premium</h3>
                  <p className="text-slate-500 text-xs mb-3">Akses semua materi PDF eksklusif</p>
                  <Link href="/dashboard/membership" className="text-orange-600 text-xs font-bold hover:underline">
                    Upgrade Sekarang →
                  </Link>
                </div>
              )}

              <div className="space-y-3">
                {MATERIALS.map(mat => {
                  const canAccess = !mat.isPremium || isPremium;
                  return (
                    <div key={mat.id} className={`card p-4 transition-all ${canAccess ? 'hover:shadow-card-hover' : 'opacity-70'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                          {mat.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{mat.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-400">{mat.type} • {mat.size}</span>
                            {mat.isPremium && <span className="badge-premium text-xs">⭐</span>}
                          </div>
                        </div>
                        {canAccess ? (
                          <button
                            onClick={() => alert(`Download: ${mat.title}\n(Mock — file akan diunduh dari server)`)}
                            className="flex-shrink-0 text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-all">
                            📥 Unduh
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">🔒 Premium</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
