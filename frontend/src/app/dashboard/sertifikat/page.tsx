'use client';
import { useQuery } from 'react-query';
import { courseAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function SertifikatPage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery('my-courses', () =>
    courseAPI.getMyCourses().then(r => r.data.data.enrollments)
  );
  const completed = (data || []).filter((e: any) => e.status === 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">🏆 Sertifikat Saya</h1>
        <p className="text-slate-500 text-sm mt-1">{completed.length} sertifikat diperoleh</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array(2).fill(0).map((_, i) => <div key={i} className="card h-48 shimmer" />)}
        </div>
      ) : completed.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Sertifikat</h3>
          <p className="text-slate-500 mb-6">Selesaikan kursus untuk mendapatkan sertifikat resmi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completed.map((enrollment: any) => (
            <div key={enrollment.id}
              className="relative overflow-hidden rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6 shadow-md">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-200/50 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-orange-200/40 to-transparent rounded-tr-full" />

              <div className="relative">
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">UI</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-700">UMKM PENGGERAK INDONESIA</p>
                    <p className="text-xs text-slate-500">Sertifikat Penyelesaian</p>
                  </div>
                </div>

                {/* Trophy */}
                <div className="text-4xl mb-3">🏆</div>

                <p className="text-xs text-slate-500 mb-1">Diberikan kepada</p>
                <h3 className="text-xl font-bold text-slate-900 font-display mb-1">{user?.name}</h3>
                <p className="text-xs text-slate-500 mb-2">telah berhasil menyelesaikan</p>
                <h4 className="font-bold text-orange-700 font-display mb-3 leading-tight">
                  {enrollment.course?.title}
                </h4>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-amber-200">
                  <div>
                    <p className="text-xs text-slate-500">Tanggal Selesai</p>
                    <p className="text-xs font-semibold text-slate-700">
                      {enrollment.completedAt
                        ? new Date(enrollment.completedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                        : '-'}
                    </p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-100 hover:bg-orange-200 px-3 py-1.5 rounded-lg transition-all">
                    🖨️ Cetak
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
