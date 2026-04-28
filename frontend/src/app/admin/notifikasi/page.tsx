'use client';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const TYPES = [
  { value: 'system', label: '🔔 Sistem', desc: 'Pengumuman platform' },
  { value: 'course', label: '🎓 Kursus', desc: 'Update kursus baru' },
  { value: 'community', label: '👥 Komunitas', desc: 'Aktivitas komunitas' },
  { value: 'achievement', label: '🏆 Achievement', desc: 'Pencapaian & reward' },
];

export default function AdminNotifikasiPage() {
  const [form, setForm] = useState({ title: '', message: '', type: 'system', target: 'all' });

  const broadcastMutation = useMutation(
    () => adminAPI.broadcast({ title: form.title, message: form.message, type: form.type }),
    {
      onSuccess: (res) => {
        toast.success(res.data.message);
        setForm({ title: '', message: '', type: 'system', target: 'all' });
      },
      onError: () => toast.error('Gagal mengirim notifikasi'),
    }
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.message) { toast.error('Lengkapi judul dan pesan'); return; }
    if (!window.confirm(`Kirim notifikasi ke semua pengguna?\n\nJudul: ${form.title}`)) return;
    broadcastMutation.mutate();
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">📢 Broadcast Notifikasi</h1>
        <p className="text-slate-500 text-sm mt-1">Kirim notifikasi ke semua pengguna platform</p>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSend} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Tipe Notifikasi</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map(t => (
                <button key={t.value} type="button" onClick={() => setForm(p => ({ ...p, type: t.value }))}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    form.type === t.value ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'
                  }`}>
                  <div className="font-semibold text-sm text-slate-800">{t.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Judul Notifikasi</label>
            <input type="text" required value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="Contoh: Kursus Baru Tersedia! 🎓"
              className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Pesan</label>
            <textarea rows={4} required value={form.message}
              onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
              placeholder="Tulis pesan notifikasi Anda di sini..."
              className="input-field resize-none" />
          </div>

          {/* Preview */}
          {form.title && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Preview Notifikasi</p>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                  {TYPES.find(t => t.value === form.type)?.label.split(' ')[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{form.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{form.message}</p>
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={broadcastMutation.isLoading || !form.title || !form.message}
            className="w-full btn-primary justify-center py-3.5 shadow-glow">
            {broadcastMutation.isLoading ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim...</>
            ) : '📢 Kirim ke Semua Pengguna'}
          </button>
        </form>
      </div>
    </div>
  );
}
