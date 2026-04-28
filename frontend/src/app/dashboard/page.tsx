'use client';
import { useQuery } from 'react-query';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { courseAPI, paymentAPI, mentoringAPI } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-slate-900 font-display">{value}</p>
          <p className="text-slate-500 text-xs mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: enrollmentsData } = useQuery('my-courses', () =>
    courseAPI.getMyCourses().then(r => r.data.data.enrollments)
  );

  const { data: transactionsData } = useQuery('transactions', () =>
    paymentAPI.getTransactions().then(r => r.data.data.orders)
  );

  const { data: bookingsData } = useQuery('my-bookings', () =>
    mentoringAPI.getMyBookings().then(r => r.data.data.bookings)
  );

  const enrollments = enrollmentsData || [];
  const transactions = transactionsData || [];
  const bookings = bookingsData || [];

  const completedCourses = enrollments.filter((e: any) => e.status === 'completed').length;
  const totalSpend = transactions.filter((t: any) => t.status === 'paid').reduce((sum: number, t: any) => sum + parseFloat(t.total), 0);
  const avgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum: number, e: any) => sum + (e.progress || 0), 0) / enrollments.length)
    : 0;

  const isPremium = user?.membership === 'premium';

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-3xl p-7 text-white relative overflow-hidden">
        <div className="absolute inset-0 batik-pattern opacity-20" />
        <div className="relative">
          <p className="text-orange-200 text-sm font-medium mb-1">
            {new Date().getHours() < 12 ? 'Selamat Pagi' : new Date().getHours() < 17 ? 'Selamat Siang' : 'Selamat Malam'} 👋
          </p>
          <h1 className="text-2xl font-bold font-display mb-1">{user?.name}</h1>
          {user?.businessName && <p className="text-orange-200 text-sm">{user.businessName}</p>}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isPremium ? 'bg-amber-400 text-amber-900' : 'bg-white/20 text-white'}`}>
              {isPremium ? '⭐ Member Premium' : '🆓 Akun Gratis'}
            </span>
            {!isPremium && (
              <Link href="/dashboard/membership"
                className="text-xs font-semibold text-white underline hover:no-underline">
                Upgrade ke Premium →
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="🎓" label="Kursus Diikuti" value={enrollments.length} color="bg-blue-100 text-blue-600" />
        <StatCard icon="✅" label="Kursus Selesai" value={completedCourses} color="bg-green-100 text-green-600" />
        <StatCard icon="📈" label="Rata-rata Progress" value={`${avgProgress}%`} color="bg-orange-100 text-orange-600" />
        <StatCard icon="💰" label="Total Transaksi" value={`Rp ${(totalSpend / 1000).toFixed(0)}K`} color="bg-purple-100 text-purple-600" />
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Enrolled Courses */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900 font-display text-lg">📚 Kursus Saya</h2>
            <Link href="/dashboard/kursus" className="text-orange-600 text-sm hover:underline font-medium">Lihat semua →</Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-3">🎓</div>
              <p className="text-slate-500 text-sm mb-4">Belum ada kursus yang diikuti</p>
              <Link href="/akademi" className="btn-primary text-sm py-2 px-5">Mulai Belajar</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {enrollments.slice(0, 3).map((enrollment: any) => (
                <Link key={enrollment.id} href={`/akademi/${enrollment.course?.slug}`}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all group">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {enrollment.course?.category === 'marketing' ? '📣' :
                     enrollment.course?.category === 'keuangan' ? '💰' :
                     enrollment.course?.category === 'digital' ? '💻' : '📚'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate group-hover:text-orange-600 transition-colors">
                      {enrollment.course?.title}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5 capitalize">{enrollment.course?.category}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Progress</span>
                        <span className="font-medium text-slate-600">{enrollment.progress || 0}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${enrollment.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`}
                          style={{ width: `${enrollment.progress || 0}%` }} />
                      </div>
                    </div>
                  </div>
                  {enrollment.status === 'completed' && (
                    <span className="badge-free text-xs flex-shrink-0">✓ Selesai</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Upcoming Bookings */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 font-display">📅 Booking Mentor</h3>
              <Link href="/dashboard/booking" className="text-orange-600 text-xs hover:underline">Lihat semua</Link>
            </div>
            {bookings.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-slate-400 text-xs mb-3">Belum ada sesi terjadwal</p>
                <Link href="/mentor" className="text-orange-600 text-xs font-semibold hover:underline">
                  Cari Mentor →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 2).map((booking: any) => (
                  <div key={booking.id} className="p-3 bg-slate-50 rounded-xl">
                    <p className="text-sm font-semibold text-slate-800">{booking.mentorName}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{booking.topic}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400">
                        {new Date(booking.scheduledAt).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </span>
                      <span className={`badge text-xs ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {booking.status === 'confirmed' ? '✓ Terkonfirmasi' :
                         booking.status === 'pending' ? '⏳ Pending' : booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 font-display">💳 Transaksi</h3>
              <Link href="/dashboard/transaksi" className="text-orange-600 text-xs hover:underline">Lihat semua</Link>
            </div>
            {transactions.length === 0 ? (
              <p className="text-slate-400 text-xs text-center py-4">Belum ada transaksi</p>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 3).map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between text-sm">
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 font-medium truncate text-xs">{t.items?.[0]?.name}</p>
                      <p className="text-slate-400 text-xs">{new Date(t.createdAt).toLocaleDateString('id-ID')}</p>
                    </div>
                    <div className="text-right ml-3 flex-shrink-0">
                      <p className="text-slate-800 font-semibold text-xs">Rp {parseInt(t.total).toLocaleString('id')}</p>
                      <span className={`text-xs ${t.status === 'paid' ? 'text-green-600' : t.status === 'pending' ? 'text-amber-600' : 'text-red-500'}`}>
                        {t.status === 'paid' ? '✓ Dibayar' : t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Premium CTA */}
          {!isPremium && (
            <div className="card p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
              <div className="text-2xl mb-2">⭐</div>
              <h3 className="font-bold text-slate-900 font-display text-base mb-1">Upgrade ke Premium</h3>
              <p className="text-slate-500 text-xs mb-4">Akses semua kursus, template & fitur eksklusif</p>
              <p className="text-amber-700 font-bold text-lg font-display">Rp 59.000<span className="text-xs font-normal text-amber-600">/bulan</span></p>
              <Link href="/dashboard/membership" className="block mt-3 text-center bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-all">
                Mulai Trial 7 Hari
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
