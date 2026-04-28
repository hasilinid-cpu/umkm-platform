'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const userLinks = [
  { href: '/dashboard', icon: '🏠', label: 'Dashboard', exact: true },
  { href: '/dashboard/kursus', icon: '🎓', label: 'Kursus Saya' },
  { href: '/dashboard/sertifikat', icon: '🏆', label: 'Sertifikat' },
  { href: '/dashboard/transaksi', icon: '💳', label: 'Transaksi' },
  { href: '/dashboard/booking', icon: '📅', label: 'Booking Mentor' },
  { href: '/dashboard/notifikasi', icon: '🔔', label: 'Notifikasi' },
  { href: '/dashboard/profil', icon: '👤', label: 'Profil' },
  { href: '/dashboard/membership', icon: '⭐', label: 'Membership' },
];

const adminLinks = [
  { href: '/admin', icon: '📊', label: 'Dashboard', exact: true },
  { href: '/admin/pengguna', icon: '👥', label: 'Pengguna' },
  { href: '/admin/kursus', icon: '🎓', label: 'Kelola Kursus' },
  { href: '/admin/produk', icon: '📦', label: 'Kelola Produk' },
  { href: '/admin/transaksi', icon: '💰', label: 'Transaksi' },
  { href: '/admin/notifikasi', icon: '📢', label: 'Broadcast' },
];

export default function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const links = isAdmin ? adminLinks : userLinks;

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-100 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">UI</span>
          </div>
          <div>
            <div className="font-bold text-slate-900 text-sm font-display leading-tight">UMKM Penggerak</div>
            <div className="text-orange-600 text-xs">Indonesia</div>
          </div>
        </Link>
      </div>

      {/* User Profile Card */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate font-display">{user?.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                user?.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                user?.membership === 'premium' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-200 text-slate-600'
              }`}>
                {user?.role === 'admin' ? '👑 Admin' : user?.membership === 'premium' ? '⭐ Premium' : '🆓 Free'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map(link => (
          <Link key={link.href} href={link.href}
            className={isActive(link.href, link.exact) ? 'sidebar-link-active' : 'sidebar-link-inactive'}>
            <span className="text-base">{link.icon}</span>
            <span className="text-sm">{link.label}</span>
          </Link>
        ))}

        {/* Admin / User switch */}
        {user?.role === 'admin' && (
          <div className="pt-2 border-t border-slate-100 mt-2">
            <Link href={isAdmin ? '/dashboard' : '/admin'}
              className="sidebar-link-inactive text-purple-600">
              <span>{isAdmin ? '👤' : '👑'}</span>
              <span className="text-sm">{isAdmin ? 'User View' : 'Admin Panel'}</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-100">
        {user?.membership === 'free' && (
          <Link href="/dashboard/membership"
            className="flex items-center gap-2 w-full mb-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl hover:from-amber-100 hover:to-orange-100 transition-all">
            <span>⭐</span>
            <div>
              <p className="text-xs font-semibold text-amber-800">Upgrade ke Premium</p>
              <p className="text-xs text-amber-600">Akses semua fitur</p>
            </div>
          </Link>
        )}
        <button onClick={() => { logout(); toast.success('Berhasil logout'); }}
          className="flex items-center gap-2.5 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Keluar
        </button>
      </div>
    </aside>
  );
}
