'use client';
import { useQuery } from 'react-query';
import { adminAPI } from '@/lib/api';
import Link from 'next/link';

function StatCard({ icon, label, value, sub, color, href }: any) {
  const inner = (
    <div className={`card p-5 hover:shadow-card-hover transition-all ${href ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{label}</p>
          <p className="text-3xl font-bold text-slate-900 font-display mt-1">{value}</p>
          {sub && <p className="text-xs text-green-600 mt-1 font-medium">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${color}`}>{icon}</div>
      </div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery('admin-stats', () =>
    adminAPI.getStats().then(r => r.data.data.stats)
  );

  const { data: ordersData } = useQuery('admin-orders', () =>
    adminAPI.getOrders({ limit: 5 }).then(r => r.data.data)
  );

  const { data: usersData } = useQuery('admin-users-recent', () =>
    adminAPI.getUsers({ limit: 5 }).then(r => r.data.data)
  );

  const stats = data || {};
  const recentOrders = ordersData?.orders || [];
  const recentUsers = usersData?.users || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">📊 Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/kursus" className="btn-secondary text-sm py-2">+ Kursus Baru</Link>
          <Link href="/admin/produk" className="btn-primary text-sm py-2">+ Produk Baru</Link>
        </div>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => <div key={i} className="card p-5 h-24 shimmer" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="👥" label="Total Pengguna" value={stats.totalUsers?.toLocaleString()} sub={`+${stats.newUsersThisMonth} bulan ini`} color="bg-blue-100" href="/admin/pengguna" />
          <StatCard icon="⭐" label="Member Premium" value={stats.premiumUsers?.toLocaleString()} sub={`${stats.totalUsers ? Math.round(stats.premiumUsers / stats.totalUsers * 100) : 0}% dari total`} color="bg-amber-100" href="/admin/pengguna" />
          <StatCard icon="🎓" label="Total Kursus" value={stats.totalCourses?.toLocaleString()} color="bg-purple-100" href="/admin/kursus" />
          <StatCard icon="📦" label="Total Produk" value={stats.totalProducts?.toLocaleString()} color="bg-teal-100" href="/admin/produk" />
          <StatCard icon="💰" label="Total Revenue" value={`Rp ${((stats.totalRevenue || 0) / 1_000_000).toFixed(1)}Jt`} color="bg-green-100" href="/admin/transaksi" />
          <StatCard icon="🛒" label="Order Sukses" value={stats.totalOrders?.toLocaleString()} color="bg-orange-100" href="/admin/transaksi" />
          <StatCard icon="📅" label="Booking Pending" value={stats.pendingBookings?.toLocaleString()} color="bg-red-100" />
          <StatCard icon="📈" label="User Baru Bulan Ini" value={stats.newUsersThisMonth?.toLocaleString()} color="bg-cyan-100" />
        </div>
      )}

      {/* Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 font-display">💳 Transaksi Terbaru</h2>
            <Link href="/admin/transaksi" className="text-orange-600 text-xs hover:underline">Lihat semua</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">Belum ada transaksi</div>
            ) : recentOrders.map((o: any) => (
              <div key={o.id} className="p-4 hover:bg-slate-50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{o.items?.[0]?.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{o.orderNumber}</p>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-sm font-bold text-slate-900">Rp {parseInt(o.total).toLocaleString('id')}</p>
                    <span className={`text-xs font-medium ${o.status === 'paid' ? 'text-green-600' : o.status === 'pending' ? 'text-amber-600' : 'text-red-500'}`}>
                      {o.status === 'paid' ? '✓ Dibayar' : o.status === 'pending' ? '⏳ Pending' : o.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 font-display">👥 Pengguna Terbaru</h2>
            <Link href="/admin/pengguna" className="text-orange-600 text-xs hover:underline">Lihat semua</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentUsers.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">Belum ada pengguna</div>
            ) : recentUsers.map((u: any) => (
              <div key={u.id} className="p-4 hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <span className={`badge text-xs flex-shrink-0 ${u.membership === 'premium' ? 'badge-premium' : 'bg-slate-100 text-slate-500'}`}>
                    {u.membership === 'premium' ? '⭐ Premium' : 'Free'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="font-bold text-slate-900 font-display mb-4">⚡ Aksi Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/admin/kursus', icon: '🎓', label: 'Tambah Kursus', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
            { href: '/admin/produk', icon: '📦', label: 'Tambah Produk', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
            { href: '/admin/pengguna', icon: '👥', label: 'Kelola User', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
            { href: '/admin/notifikasi', icon: '📢', label: 'Broadcast', color: 'bg-orange-50 text-orange-700 hover:bg-orange-100' },
          ].map((action, i) => (
            <Link key={i} href={action.href}
              className={`flex items-center gap-3 p-4 rounded-xl font-medium text-sm transition-all ${action.color}`}>
              <span className="text-xl">{action.icon}</span>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
