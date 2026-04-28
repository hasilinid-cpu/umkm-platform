'use client';
import { useQuery } from 'react-query';
import Link from 'next/link';
import { mentoringAPI } from '@/lib/api';

const STATUS: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: 'Menunggu Konfirmasi', color: 'bg-amber-100 text-amber-700', icon: '⏳' },
  confirmed: { label: 'Terkonfirmasi', color: 'bg-green-100 text-green-700', icon: '✅' },
  completed: { label: 'Selesai', color: 'bg-blue-100 text-blue-700', icon: '🏁' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700', icon: '❌' },
};

export default function BookingPage() {
  const { data, isLoading } = useQuery('my-bookings', () =>
    mentoringAPI.getMyBookings().then(r => r.data.data.bookings)
  );

  const bookings = data || [];
  const upcoming = bookings.filter((b: any) => ['pending', 'confirmed'].includes(b.status));
  const past = bookings.filter((b: any) => ['completed', 'cancelled'].includes(b.status));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">📅 Booking Mentor</h1>
          <p className="text-slate-500 text-sm mt-1">Jadwal sesi konsultasi Anda</p>
        </div>
        <Link href="/mentor" className="btn-primary text-sm py-2.5">
          + Booking Baru
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, i) => <div key={i} className="card p-5 h-28 shimmer" />)}
        </div>
      ) : bookings.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Booking</h3>
          <p className="text-slate-500 mb-6">Konsultasikan masalah bisnis Anda dengan mentor expert</p>
          <Link href="/mentor" className="btn-primary">🎯 Temukan Mentor</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-800 font-display mb-4">📌 Sesi Mendatang</h2>
              <div className="space-y-4">
                {upcoming.map((b: any) => <BookingCard key={b.id} booking={b} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="font-bold text-slate-800 font-display mb-4">📋 Riwayat Sesi</h2>
              <div className="space-y-4">
                {past.map((b: any) => <BookingCard key={b.id} booking={b} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BookingCard({ booking }: { booking: any }) {
  const status = STATUS[booking.status] || STATUS.pending;
  const date = new Date(booking.scheduledAt);
  return (
    <div className="card p-5 hover:shadow-card-hover transition-all">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {booking.mentorName?.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-bold text-slate-900 font-display">{booking.mentorName}</h3>
              <p className="text-orange-600 text-sm font-medium mt-0.5 line-clamp-1">{booking.topic}</p>
            </div>
            <span className={`badge text-xs ${status.color} flex-shrink-0`}>{status.icon} {status.label}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              📆 {date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span>⏰ {date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
            <span>⏱️ {booking.duration} menit</span>
            <span>💰 Rp {parseInt(booking.amount).toLocaleString('id')}</span>
          </div>
          {booking.status === 'confirmed' && booking.meetingUrl && (
            <a href={booking.meetingUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-all">
              📹 Bergabung ke Meeting
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
