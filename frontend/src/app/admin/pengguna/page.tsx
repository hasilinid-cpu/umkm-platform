'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminPenggunaPage() {
  const [search, setSearch] = useState('');
  const [membership, setMembership] = useState('');
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState<any>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery(
    ['admin-users', { search, membership, page }],
    () => adminAPI.getUsers({ search, membership, page, limit: 15 }).then(r => r.data.data)
  );

  const updateMutation = useMutation(
    ({ id, data }: any) => adminAPI.updateUser(id, data),
    {
      onSuccess: () => {
        toast.success('User berhasil diperbarui');
        setEditUser(null);
        qc.invalidateQueries('admin-users');
      },
      onError: () => toast.error('Gagal memperbarui user'),
    }
  );

  const users = data?.users || [];
  const total = data?.total || 0;
  const pages = Math.ceil(total / 15);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">👥 Kelola Pengguna</h1>
          <p className="text-slate-500 text-sm mt-1">{total.toLocaleString()} total pengguna</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Cari nama atau email..."
            className="input-field pl-9 text-sm py-2.5" />
        </div>
        <select value={membership} onChange={e => { setMembership(e.target.value); setPage(1); }}
          className="input-field w-auto text-sm py-2.5 px-3">
          <option value="">Semua Membership</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Pengguna', 'Email', 'Bisnis', 'Role', 'Membership', 'Bergabung', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                Array(8).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-4 shimmer rounded" /></td></tr>
                ))
              ) : users.map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-all">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">{u.email}</td>
                  <td className="px-4 py-3 text-slate-500 text-xs truncate max-w-32">{u.businessName || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${
                      u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      u.role === 'mentor' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'
                    }`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge text-xs ${u.membership === 'premium' ? 'badge-premium' : 'bg-slate-100 text-slate-500'}`}>
                      {u.membership === 'premium' ? '⭐ Premium' : '🆓 Free'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {new Date(u.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setEditUser(u)}
                      className="text-orange-600 hover:underline text-xs font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="p-4 border-t border-slate-100 flex justify-center gap-2">
            {Array.from({ length: Math.min(pages, 8) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${page === p ? 'bg-orange-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-orange-50'}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-slate-900 font-display">Edit Pengguna</h3>
              <button onClick={() => setEditUser(null)} className="text-slate-400 hover:text-red-500 text-xl">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-slate-700 mb-1">Nama</p>
                <p className="text-slate-500 text-sm">{editUser.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                <select defaultValue={editUser.role}
                  onChange={e => setEditUser((u: any) => ({ ...u, role: e.target.value }))}
                  className="input-field">
                  <option value="user">User</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Membership</label>
                <select defaultValue={editUser.membership}
                  onChange={e => setEditUser((u: any) => ({ ...u, membership: e.target.value }))}
                  className="input-field">
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select defaultValue={editUser.isActive ? 'true' : 'false'}
                  onChange={e => setEditUser((u: any) => ({ ...u, isActive: e.target.value === 'true' }))}
                  className="input-field">
                  <option value="true">Aktif</option>
                  <option value="false">Nonaktif</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setEditUser(null)} className="flex-1 btn-secondary text-sm py-2.5">Batal</button>
                <button
                  onClick={() => updateMutation.mutate({ id: editUser.id, data: { role: editUser.role, membership: editUser.membership, isActive: editUser.isActive } })}
                  disabled={updateMutation.isLoading}
                  className="flex-1 btn-primary text-sm py-2.5">
                  {updateMutation.isLoading ? 'Menyimpan...' : '💾 Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
