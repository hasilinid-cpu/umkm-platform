'use client';
import { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mentoringAPI, paymentAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const DAYS = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
const DAY_LABELS: Record<string, string> = { senin: 'Sen', selasa: 'Sel', rabu: 'Rab', kamis: 'Kam', jumat: 'Jum', sabtu: 'Sab' };

function MentorCard({ mentor, onBook }: { mentor: any; onBook: (m: any) => void }) {
  return (
    <div className="card p-6 hover:shadow-card-hover transition-all group">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 group-hover:scale-105 transition-transform">
          {mentor.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 font-display">{mentor.name}</h3>
          <p className="text-orange-600 text-sm font-medium">{mentor.title}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
            <span>⭐ {mentor.rating}</span>
            <span>•</span>
            <span>{mentor.totalSessions} sesi</span>
            <span>•</span>
            <span>{mentor.experience} tahun exp</span>
          </div>
        </div>
      </div>

      <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">{mentor.bio}</p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {mentor.specializations?.map((s: string, i: number) => (
          <span key={i} className="badge bg-orange-50 text-orange-700 text-xs">{s}</span>
        ))}
      </div>

      {/* Availability */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Jadwal Tersedia</p>
        <div className="flex gap-1.5 flex-wrap">
          {DAYS.filter(d => mentor.availability?.[d]?.length > 0).map(day => (
            <span key={day} className="badge bg-green-100 text-green-700 text-xs">{DAY_LABELS[day]}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div>
          <span className="text-xl font-bold text-orange-600 font-display">Rp {parseInt(mentor.sessionPrice).toLocaleString('id')}</span>
          <span className="text-slate-400 text-xs">/sesi</span>
        </div>
        <button onClick={() => onBook(mentor)} className="btn-primary text-sm py-2.5 px-5">
          📅 Booking Sesi
        </button>
      </div>
    </div>
  );
}

function BookingModal({ mentor, onClose, onSuccess }: { mentor: any; onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({ day: '', time: '', topic: '', description: '' });
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const availableDays = DAYS.filter(d => mentor.availability?.[d]?.length > 0);
  const availableTimes = form.day ? (mentor.availability?.[form.day] || []) : [];

  const bookMutation = useMutation(async () => {
    if (!form.day || !form.time || !form.topic) throw new Error('Lengkapi form');
    const scheduledAt = new Date();
    scheduledAt.setHours(parseInt(form.time.split(':')[0]), parseInt(form.time.split(':')[1]));

    const bookingRes = await mentoringAPI.createBooking({
      mentorId: mentor.id, scheduledAt, duration: 60, topic: form.topic, description: form.description,
    });
    const booking = bookingRes.data.data.booking;

    const payRes = await paymentAPI.create({ type: 'booking', referenceId: booking.id });
    const { order } = payRes.data.data;

    if (window.confirm(`Konfirmasi Booking\n\nMentor: ${mentor.name}\nTanggal: ${form.day} ${form.time}\nTopik: ${form.topic}\nBiaya: Rp ${parseInt(mentor.sessionPrice).toLocaleString('id')}\n\nLanjutkan pembayaran? (Mock)`)) {
      await paymentAPI.confirm(order.id);
    }
    return booking;
  }, {
    onSuccess: () => {
      toast.success('Booking berhasil! Mentor akan menghubungi Anda 📅');
      onSuccess();
      onClose();
    },
    onError: (err: any) => toast.error(err.message || 'Gagal booking sesi'),
  });

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="card p-8 max-w-sm w-full text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h3 className="font-bold text-slate-900 font-display mb-2">Login Diperlukan</h3>
          <p className="text-slate-500 text-sm mb-6">Silakan login terlebih dahulu untuk booking sesi mentor.</p>
          <button onClick={() => router.push('/login')} className="w-full btn-primary justify-center">Masuk Sekarang</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="card p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-900 font-display text-lg">📅 Booking Sesi Konsultasi</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 text-2xl transition-colors">×</button>
        </div>

        {/* Mentor info */}
        <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl mb-5">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold">
            {mentor.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-slate-900">{mentor.name}</p>
            <p className="text-orange-600 text-sm">{mentor.title}</p>
            <p className="text-slate-600 text-xs font-medium">Rp {parseInt(mentor.sessionPrice).toLocaleString('id')} / sesi (60 menit)</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Hari</label>
            <div className="grid grid-cols-3 gap-2">
              {availableDays.map(day => (
                <button key={day} type="button" onClick={() => setForm(p => ({ ...p, day, time: '' }))}
                  className={`py-2.5 rounded-xl text-sm font-medium capitalize transition-all border ${
                    form.day === day ? 'bg-orange-600 text-white border-orange-600' : 'border-slate-200 text-slate-600 hover:border-orange-400'
                  }`}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {form.day && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Jam</label>
              <div className="grid grid-cols-4 gap-2">
                {availableTimes.map((time: string) => (
                  <button key={time} type="button" onClick={() => setForm(p => ({ ...p, time }))}
                    className={`py-2.5 rounded-xl text-sm font-medium transition-all border ${
                      form.time === time ? 'bg-orange-600 text-white border-orange-600' : 'border-slate-200 text-slate-600 hover:border-orange-400'
                    }`}>
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Topik Konsultasi</label>
            <input type="text" value={form.topic} onChange={e => setForm(p => ({ ...p, topic: e.target.value }))}
              placeholder="Contoh: Strategi ekspansi bisnis ke marketplace"
              className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Deskripsi Masalah (opsional)</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Ceritakan lebih detail tentang bisnis Anda dan masalah yang ingin didiskusikan..."
              className="input-field resize-none" />
          </div>

          <button onClick={() => bookMutation.mutate()} disabled={bookMutation.isLoading || !form.day || !form.time || !form.topic}
            className="w-full btn-primary justify-center py-3.5 shadow-glow">
            {bookMutation.isLoading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
            ) : '💳 Konfirmasi & Bayar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MentorPage() {
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [booked, setBooked] = useState(false);

  const { data, isLoading } = useQuery('mentors', () =>
    mentoringAPI.getMentors({}).then(r => r.data.data.mentors)
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block badge bg-teal-500/20 border border-teal-500/30 text-teal-300 mb-4">🩺 Klinik Bisnis</div>
          <h1 className="text-4xl font-bold text-white font-display mb-3">
            Konsultasi Langsung dengan <span className="gradient-text">Pakar Bisnis</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-6">
            Sesi 1-on-1 dengan mentor berpengalaman. Dapatkan solusi nyata untuk masalah bisnis Anda.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {[['🎯 Sesi Terarah', 'Diskusi fokus 60 menit'], ['📹 Via Video Call', 'Zoom / Google Meet'], ['✅ Terbukti Efektif', '98% klien puas']].map(([title, desc], i) => (
              <div key={i} className="text-center">
                <div className="text-white font-semibold">{title}</div>
                <div className="text-slate-400 text-xs mt-0.5">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="card p-6 space-y-4">
                <div className="flex gap-4"><div className="w-16 h-16 shimmer rounded-2xl flex-shrink-0" /><div className="flex-1 space-y-2"><div className="h-4 shimmer rounded" /><div className="h-3 shimmer rounded w-2/3" /></div></div>
                <div className="h-3 shimmer rounded" /><div className="h-3 shimmer rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((mentor: any) => (
              <MentorCard key={mentor.id} mentor={mentor} onBook={setSelectedMentor} />
            ))}
          </div>
        )}
      </div>

      {selectedMentor && (
        <BookingModal mentor={selectedMentor} onClose={() => setSelectedMentor(null)} onSuccess={() => setBooked(true)} />
      )}

      <Footer />
    </div>
  );
}
