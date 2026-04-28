'use client';
import { useQuery } from 'react-query';
import Link from 'next/link';
import { courseAPI } from '@/lib/api';

export default function DashboardKursusPage() {
  const { data, isLoading } = useQuery('my-courses', () =>
    courseAPI.getMyCourses().then(r => r.data.data.enrollments)
  );

  const enrollments = data || [];
  const active = enrollments.filter((e: any) => e.status === 'active');
  const completed = enrollments.filter((e: any) => e.status === 'completed');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">🎓 Kursus Saya</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola dan lanjutkan perjalanan belajar Anda</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Kursus', value: enrollments.length, color: 'bg-blue-50 text-blue-700' },
          { label: 'Sedang Belajar', value: active.length, color: 'bg-orange-50 text-orange-700' },
          { label: 'Selesai', value: completed.length, color: 'bg-green-50 text-green-700' },
        ].map((s, i) => (
          <div key={i} className={`card p-4 text-center ${s.color}`}>
            <div className="text-2xl font-bold font-display">{s.value}</div>
            <div className="text-xs mt-0.5 opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="card p-5 space-y-3">
              <div className="flex gap-4"><div className="w-16 h-16 shimmer rounded-xl flex-shrink-0" /><div className="flex-1 space-y-2"><div className="h-4 shimmer rounded w-3/4" /><div className="h-3 shimmer rounded w-1/2" /></div></div>
              <div className="h-2 shimmer rounded-full" />
            </div>
          ))}
        </div>
      ) : enrollments.length === 0 ? (
        <div className="text-center py-20 card">
          <div className="text-5xl mb-4">🎓</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Kursus</h3>
          <p className="text-slate-500 mb-6">Mulai belajar sekarang dan tingkatkan bisnis Anda</p>
          <Link href="/akademi" className="btn-primary">🚀 Jelajahi Kursus</Link>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-800 font-display mb-4">📖 Sedang Dipelajari</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {active.map((enrollment: any) => (
                  <CourseProgressCard key={enrollment.id} enrollment={enrollment} />
                ))}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-800 font-display mb-4">✅ Sudah Selesai</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {completed.map((enrollment: any) => (
                  <CourseProgressCard key={enrollment.id} enrollment={enrollment} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CourseProgressCard({ enrollment }: { enrollment: any }) {
  const { course } = enrollment;
  const isCompleted = enrollment.status === 'completed';

  const categoryIcon: Record<string, string> = {
    marketing: '📣', keuangan: '💰', operasional: '⚙️',
    digital: '💻', legal: '⚖️', leadership: '👑', ekspor: '🌏',
  };

  return (
    <div className="card p-5 hover:shadow-card-hover transition-all">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
          {categoryIcon[course?.category] || '📚'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 font-display text-sm leading-tight mb-1 line-clamp-2">
            {course?.title}
          </h3>
          <p className="text-slate-400 text-xs capitalize">{course?.category} • {course?.level}</p>
          <p className="text-slate-400 text-xs mt-0.5">👤 {course?.mentorName}</p>
        </div>
        {isCompleted && (
          <span className="badge-free text-xs flex-shrink-0">✓ Selesai</span>
        )}
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
          <span>Progress Belajar</span>
          <span className="font-semibold text-slate-700">{enrollment.progress || 0}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-orange-500 to-amber-500'}`}
            style={{ width: `${enrollment.progress || 0}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{enrollment.completedLessons?.length || 0} dari {course?.totalLessons || 0} video</span>
          {enrollment.lastAccessedAt && (
            <span>Terakhir: {new Date(enrollment.lastAccessedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Link href={`/akademi/${course?.slug}`}
          className={`flex-1 text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${
            isCompleted
              ? 'bg-green-50 text-green-700 hover:bg-green-100'
              : 'bg-orange-600 text-white hover:bg-orange-700 shadow-md'
          }`}>
          {isCompleted ? '🔍 Review Kursus' : '▶ Lanjut Belajar'}
        </Link>
        {isCompleted && (
          <Link href="/dashboard/sertifikat"
            className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all">
            🏆
          </Link>
        )}
      </div>
    </div>
  );
}
