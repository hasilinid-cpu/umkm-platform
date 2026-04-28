'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const businessTypes = ['Kuliner', 'Fashion', 'Teknologi', 'Pertanian', 'Kerajinan', 'Jasa', 'Retail', 'Ekspor', 'Lainnya'];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', businessName: '', businessType: '', city: '' });
  const [showPass, setShowPass] = useState(false);
  const { register, isLoading } = useAuthStore();
  const router = useRouter();
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Password tidak cocok!'); return; }
    if (form.password.length < 6) { toast.error('Password minimal 6 karakter'); return; }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { confirmPassword, ...data } = form;
      await register(data);
      toast.success('Akun berhasil dibuat! Selamat datang 🎉');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registrasi gagal');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 batik-pattern opacity-20" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">UI</span>
            </div>
            <div className="text-left">
              <div className="font-bold text-white text-lg font-display">UMKM Penggerak</div>
              <div className="text-orange-400 text-sm">Indonesia</div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white font-display mt-4">Buat Akun Gratis</h1>
          <p className="text-slate-400 text-sm mt-1">Bergabunglah bersama 50.000+ UMKM Indonesia</p>
        </div>

        <div className="flex items-center gap-2 mb-6 px-4">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-orange-600 text-white' : 'bg-white/10 text-slate-400'}`}>{s}</div>
              <span className={`text-xs ${step >= s ? 'text-orange-400' : 'text-slate-600'}`}>{s === 1 ? 'Akun' : 'Bisnis'}</span>
              {s < 2 && <div className={`flex-1 h-0.5 rounded ${step > s ? 'bg-orange-600' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-5">
              {[
                { key: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Nama Anda' },
                { key: 'email', label: 'Email', type: 'email', placeholder: 'nama@email.com' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-slate-300 text-sm font-medium mb-2">{label}</label>
                  <input type={type} required value={(form as any)[key]}
                    onChange={e => update(key, e.target.value)} placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} required value={form.password}
                    onChange={e => update('password', e.target.value)} placeholder="Min. 6 karakter"
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Konfirmasi Password</label>
                <input type="password" required value={form.confirmPassword}
                  onChange={e => update('confirmPassword', e.target.value)} placeholder="Ulangi password"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm" />
              </div>
              <button type="submit" className="w-full btn-primary justify-center py-3.5 text-base shadow-glow">Lanjut →</button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Nama Bisnis <span className="text-slate-500">(opsional)</span></label>
                <input type="text" value={form.businessName} onChange={e => update('businessName', e.target.value)} placeholder="Contoh: Warung Siti"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm" />
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Jenis Bisnis</label>
                <select value={form.businessType} onChange={e => update('businessType', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm">
                  <option value="">Pilih jenis bisnis...</option>
                  {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">Kota / Kabupaten</label>
                <input type="text" value={form.city} onChange={e => update('city', e.target.value)} placeholder="Contoh: Jakarta, Surabaya"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm" />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all text-sm font-medium">← Kembali</button>
                <button type="submit" disabled={isLoading} className="flex-1 btn-primary justify-center py-3 shadow-glow text-sm">
                  {isLoading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mendaftar...</> : '🚀 Daftar Sekarang'}
                </button>
              </div>
            </form>
          )}
          <p className="text-center text-slate-400 text-sm mt-6">
            Sudah punya akun? <Link href="/login" className="text-orange-400 hover:text-orange-300 font-semibold">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
