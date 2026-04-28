'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { paymentAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';

const FEATURES = [
  { icon: '🎓', text: 'Akses semua 200+ kursus tanpa batas' },
  { icon: '🔄', text: 'Re-Learning: akses kembali semua materi' },
  { icon: '📦', text: 'Semua template & modul bisnis' },
  { icon: '👥', text: 'Komunitas Premium eksklusif' },
  { icon: '🏆', text: 'Sertifikat untuk semua kursus' },
  { icon: '📅', text: 'Diskon 20% sesi konsultasi mentor' },
  { icon: '📥', text: 'Download PDF unlimited' },
  { icon: '🚀', text: 'Early access konten baru' },
];

export default function MembershipPage() {
  const { user, fetchMe } = useAuthStore();
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  const isPremium = user?.membership === 'premium';
  const expiresAt = user?.membershipExpiresAt ? new Date(user.membershipExpiresAt) : null;
  const isExpired = expiresAt ? expiresAt < new Date() : false;

  const prices = { monthly: 59000, yearly: 49000 };
  const savings = (prices.monthly - prices.yearly) * 12;

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await paymentAPI.create({ type: 'membership', plan });
      const { order } = res.data.data;

      const confirmMsg = plan === 'yearly'
        ? `Paket Premium Tahunan\nTotal: Rp ${(prices.yearly * 12).toLocaleString('id')}/tahun\n\nSimulasi pembayaran berhasil? (Mock)`
        : `Paket Premium Bulanan\nTotal: Rp ${prices.monthly.toLocaleString('id')}/bulan\n\nSimulasi pembayaran berhasil? (Mock)`;

      if (window.confirm(confirmMsg)) {
        await paymentAPI.confirm(order.id);
        await fetchMe();
        qc.invalidateQueries();
        toast.success('🎉 Selamat! Anda kini Member Premium!');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal memproses pembayaran');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">⭐ Membership</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola paket berlangganan Anda</p>
      </div>

      {/* Current Status */}
      {isPremium && !isExpired ? (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-7 text-white">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⭐</div>
            <div>
              <h2 className="text-xl font-bold font-display">Anda adalah Member Premium!</h2>
              <p className="text-amber-100 mt-1">
                Akses Anda aktif hingga{' '}
                <span className="font-bold text-white">
                  {expiresAt?.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['200+ Kursus', 'Template Bisnis', 'Komunitas VIP', 'Sertifikat'].map(f => (
                  <span key={f} className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">✓ {f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🆓</div>
            <div>
              <h2 className="font-bold text-slate-800 font-display">Akun Gratis</h2>
              <p className="text-slate-500 text-sm">Upgrade untuk akses fitur lengkap</p>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Section */}
      {(!isPremium || isExpired) && (
        <div className="card p-7">
          <h2 className="text-xl font-bold text-slate-900 font-display mb-6">🚀 Upgrade ke Premium</h2>

          {/* Plan Toggle */}
          <div className="grid grid-cols-2 gap-3 mb-7">
            {(['monthly', 'yearly'] as const).map(p => (
              <button key={p} onClick={() => setPlan(p)}
                className={`p-5 rounded-2xl border-2 text-left transition-all ${
                  plan === p ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 font-display capitalize">
                    {p === 'monthly' ? 'Bulanan' : 'Tahunan'}
                  </span>
                  {p === 'yearly' && (
                    <span className="badge bg-green-100 text-green-700 text-xs">Hemat 17%</span>
                  )}
                </div>
                <div className="text-2xl font-bold text-orange-600 font-display">
                  Rp {prices[p].toLocaleString('id')}
                  <span className="text-sm font-normal text-slate-400">/bulan</span>
                </div>
                {p === 'yearly' && (
                  <div className="text-xs text-green-600 mt-1 font-medium">
                    Hemat Rp {savings.toLocaleString('id')}/tahun
                  </div>
                )}
                {p === 'monthly' && (
                  <div className="text-xs text-slate-400 mt-1">Bebas batal kapan saja</div>
                )}
              </button>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-7">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                <span className="text-base flex-shrink-0">{f.icon}</span>
                {f.text}
              </div>
            ))}
          </div>

          <button onClick={handleUpgrade} disabled={loading}
            className="w-full btn-primary justify-center py-4 text-base shadow-glow-lg">
            {loading ? (
              <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
            ) : `🚀 Upgrade Premium ${plan === 'yearly' ? 'Tahunan' : 'Bulanan'} — Rp ${(plan === 'yearly' ? prices.yearly * 12 : prices.monthly).toLocaleString('id')}`}
          </button>
          <p className="text-center text-slate-400 text-xs mt-3">Garansi uang kembali 30 hari • Batalkan kapan saja</p>
        </div>
      )}

      {/* Renew for premium */}
      {isPremium && !isExpired && (
        <div className="card p-6 border border-amber-200 bg-amber-50">
          <h3 className="font-bold text-slate-900 font-display mb-4">🔄 Perpanjang Membership</h3>
          <div className="grid grid-cols-2 gap-3">
            {(['monthly', 'yearly'] as const).map(p => (
              <button key={p} onClick={() => setPlan(p)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${plan === p ? 'border-amber-500 bg-white' : 'border-amber-200 hover:border-amber-300'}`}>
                <div className="font-bold text-slate-900 text-sm capitalize">{p === 'monthly' ? 'Bulanan' : 'Tahunan'}</div>
                <div className="text-amber-600 font-bold">Rp {prices[p].toLocaleString('id')}<span className="text-xs font-normal text-slate-400">/bln</span></div>
              </button>
            ))}
          </div>
          <button onClick={handleUpgrade} disabled={loading} className="w-full btn-primary justify-center py-3 mt-4">
            {loading ? 'Memproses...' : '🔄 Perpanjang Sekarang'}
          </button>
        </div>
      )}
    </div>
  );
}
