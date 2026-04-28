'use client';
import { useState } from 'react';
import { useQuery } from 'react-query';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { courseAPI } from '@/lib/api';

const CATEGORIES = [
  { value: '', label: '🔥 Semua' },
  { value: 'marketing', label: '📣 Marketing' },
  { value: 'keuangan', label: '💰 Keuangan' },
  { value: 'operasional', label: '⚙️ Operasional' },
  { value: 'digital', label: '💻 Digital' },
  { value: 'legal', label: '⚖️ Legal' },
  { value: 'leadership', label: '👑 Leadership' },
  { value: 'ekspor', label: '🌏 Ekspor' },
];

const LEVELS = [
  { value: '', label: 'Semua Level' },
  { value: 'pemula', label: 'Pemula' },
  { value: 'menengah', label: 'Menengah' },
  { value: 'mahir', label: 'Mahir' },
];

function CourseCard({ course }: { course: any }) {
  return (
    <Link href={`/akademi/${course.slug}`}
      className="card card-hover group block">
      <div className="aspect-video bg-gradient-to-br from-orange-100 to-amber-100 relative overflow-hidden">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {course.category === 'marketing' ? '📣' : course.category === 'keuangan' ? '💰' :
             course.category === 'digital' ? '💻' : course.category === 'ekspor' ? '🌏' : '📚'}
          </div>
        )}
        {course.isFree && <span className="absolute top-3 left-3 badge-free text-xs">GRATIS</span>}
        {course.isPremiumOnly && <span className="absolute top-3 left-3 badge-premium text-xs">⭐ PREMIUM</span>}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg">
          {Math.floor(course.totalDuration / 60)}j {course.totalDuration % 60}m
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge bg-orange-100 text-orange-700 text-xs capitalize">{course.category}</span>
          <span className="badge bg-slate-100 text-slate-600 text-xs capitalize">{course.level}</span>
        </div>
        <h3 className="font-bold text-slate-900 text-base leading-snug mb-2 font-display group-hover:text-orange-600 transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="text-slate-500 text-xs mb-3 line-clamp-2">{course.shortDescription}</p>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <span className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-700">
            {course.mentorName?.charAt(0)}
          </span>
          {course.mentorName}
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">⭐ <span className="font-semibold text-slate-700">{course.rating}</span></span>
          <span>({course.reviewCount?.toLocaleString()})</span>
          <span>•</span>
          <span>{course.enrollmentCount?.toLocaleString()} siswa</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          {course.isFree ? (
            <span className="text-green-600 font-bold">Gratis</span>
          ) : (
            <div>
              <span className="text-orange-600 font-bold">Rp {parseInt(course.price).toLocaleString('id')}</span>
              {course.originalPrice > course.price && (
                <span className="text-slate-400 text-xs line-through ml-2">
                  Rp {parseInt(course.originalPrice).toLocaleString('id')}
                </span>
              )}
            </div>
          )}
          <span className="text-xs text-slate-400">{course.totalLessons} video</span>
        </div>
      </div>
    </Link>
  );
}

export default function AkademiPage() {
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery(
    ['courses', { category, level, search, sort, page }],
    () => courseAPI.getAll({ category, level, search, sort, page, limit: 9 }).then(r => r.data.data),
    { keepPreviousData: true }
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block badge bg-orange-500/20 border border-orange-500/30 text-orange-300 mb-4">🎓 Akademi UMKM</div>
            <h1 className="text-4xl font-bold text-white font-display mb-3">Kursus untuk <span className="gradient-text">UMKM Sukses</span></h1>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
              200+ kursus dari mentor berpengalaman. Belajar kapan saja, di mana saja.
            </p>
            <div className="max-w-lg mx-auto relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Cari kursus, topik, atau mentor..."
                className="w-full pl-11 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm backdrop-blur" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="card p-5 sticky top-24">
              <h3 className="font-bold text-slate-800 mb-4 font-display">Filter Kursus</h3>
              <div className="mb-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Kategori</p>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button key={cat.value} onClick={() => { setCategory(cat.value); setPage(1); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        category === cat.value ? 'bg-orange-100 text-orange-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Level</p>
                <div className="space-y-1">
                  {LEVELS.map(lv => (
                    <button key={lv.value} onClick={() => { setLevel(lv.value); setPage(1); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        level === lv.value ? 'bg-orange-100 text-orange-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}>
                      {lv.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-600 text-sm">
                {isLoading ? 'Memuat...' : `${data?.pagination?.total || 0} kursus ditemukan`}
              </p>
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="text-sm border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                <option value="createdAt">Terbaru</option>
                <option value="popular">Terpopuler</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="card overflow-hidden">
                    <div className="aspect-video shimmer" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 shimmer rounded w-3/4" />
                      <div className="h-3 shimmer rounded w-full" />
                      <div className="h-3 shimmer rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data?.courses?.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Kursus tidak ditemukan</h3>
                <p className="text-slate-500">Coba kata kunci atau filter yang berbeda</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data?.courses?.map((course: any) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>

                {/* Pagination */}
                {data?.pagination?.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                          page === p ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-orange-50 border border-slate-200'
                        }`}>
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
