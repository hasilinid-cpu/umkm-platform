'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const businessTypes = ['Kuliner', 'Fashion & Pakaian', 'Kerajinan Tangan', 'Teknologi', 'Pertanian', 'Jasa', 'Retail', 'Kesehatan & Kecantikan', 'Pendidikan', 'Lainnya'];

export default function ProfilPage() {
  const { user, updateProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    businessName: user?.businessName || '',
    businessType: user?.businessType || '',
    city: user?.city || '',
  });

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success('Profil berhasil diperbarui! ✅');
    } catch {
      toast.error('Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">👤 Profil Saya</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola informasi akun dan bisnis Anda</p>
      </div>

      {/* Avatar Card */}
      <div className="card p-6 flex items-center gap-5">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-glow">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-bold text-slate-900 font-display text-lg">{user?.name}</h2>
          <p className="text-slate-500 text-sm">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`badge text-xs ${user?.membership === 'premium' ? 'badge-premium' : 'bg-slate-100 text-slate-600'}`}>
              {user?.membership === 'premium' ? '⭐ Premium' : '🆓 Free'}
            </span>
            <span className={`badge text-xs ${
              user?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
              user?.role === 'mentor' ? 'bg-teal-100 text-teal-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {user?.role === 'admin' ? '👑 Admin' : user?.role === 'mentor' ? '🎓 Mentor' : '👤 User'}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="card p-6 space-y-5">
        <h3 className="font-bold text-slate-900 font-display">Informasi Pribadi</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} className="input-field" placeholder="Nama lengkap Anda" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">No. HP / WhatsApp</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} className="input-field" placeholder="+62 812 3456 7890" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Bio Singkat</label>
          <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} className="input-field resize-none" placeholder="Ceritakan sedikit tentang Anda dan bisnis Anda..." />
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h3 className="font-bold text-slate-900 font-display mb-4">Informasi Bisnis</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nama Bisnis / Usaha</label>
              <input value={form.businessName} onChange={e => set('businessName', e.target.value)} className="input-field" placeholder="Nama toko / usaha Anda" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Jenis Bisnis</label>
              <select value={form.businessType} onChange={e => set('businessType', e.target.value)} className="input-field">
                <option value="">Pilih jenis bisnis</option>
                {businessTypes.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Kota / Kabupaten</label>
              <input value={form.city} onChange={e => set('city', e.target.value)} className="input-field" placeholder="Kota domisili bisnis" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={loading} className="btn-primary px-8">
            {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</> : '💾 Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}
