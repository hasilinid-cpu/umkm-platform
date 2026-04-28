'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success('Selamat datang kembali! 👋');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Login gagal, coba lagi');
    }
  };

  const fillDemo = (role: string) => {
    const accounts: any = {
      admin: { email: 'admin@umkmpengerak.id', password: 'Admin123!' },
      premium: { email: 'andi@example.com', password: 'Andi123!' },
      free: { email: 'siti@example.com', password: 'Siti123!' },
    };
    setForm(accounts[role]);
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
          <h1 className="text-2xl font-bold text-white font-display mt-4">Masuk ke Akun</h1>
          <p className="text-slate-400 text-sm mt-1">Lanjutkan perjalanan belajar Anda</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="mb-6">
            <p className="text-slate-400 text-xs mb-2 text-center">Demo Accounts:</p>
            <div className="flex gap-2">
              {[
                { role: 'admin', label: '👑 Admin', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
                { role: 'premium', label: '⭐ Premium', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
                { role: 'free', label: '🆓 Free', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
              ].map(({ role, label, color }) => (
                <button key={role} onClick={() => fillDemo(role)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-all hover:opacity-80 ${color}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm" />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Password Anda"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              <div className="flex justify-end mt-1">
                <Link href="/lupa-password" className="text-xs text-orange-400 hover:text-orange-300">Lupa password?</Link>
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full btn-primary justify-center py-3.5 text-base shadow-glow">
              {isLoading
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
                : 'Masuk Sekarang'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Belum punya akun?{' '}
            <Link href="/register" className="text-orange-400 hover:text-orange-300 font-semibold">Daftar Gratis</Link>
          </p>
        </div>
        <p className="text-center text-slate-600 text-xs mt-6">
          <Link href="/" className="hover:text-slate-400">← Kembali ke Beranda</Link>
        </p>
      </div>
    </div>
  );
}
