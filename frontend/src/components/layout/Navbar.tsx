'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { notificationAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const navLinks = [
  { href: '/akademi', label: 'Akademi' },
  { href: '/modul', label: 'Modul Bisnis' },
  { href: '/komunitas', label: 'Komunitas' },
  { href: '/mentor', label: 'Klinik Bisnis' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated, logout } = useAuthStore();
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      notificationAPI.getAll()
        .then(res => {
          setNotifications(res.data.data.notifications.slice(0, 5));
          setUnreadCount(res.data.data.unreadCount);
        }).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleMarkRead = async () => {
    try {
      await notificationAPI.markAllRead();
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch {}
  };

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">UI</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-slate-900 text-sm leading-tight font-display">UMKM Penggerak</div>
              <div className="text-orange-600 text-xs font-medium">Indonesia</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href) ? 'text-orange-600 bg-orange-50' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 rounded-xl text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-orange-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                        <span className="font-semibold text-slate-800 font-display">Notifikasi</span>
                        {unreadCount > 0 && (
                          <button onClick={handleMarkRead} className="text-xs text-orange-600 hover:underline">Tandai semua dibaca</button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 text-sm">Belum ada notifikasi</div>
                        ) : notifications.map(n => (
                          <div key={n.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-all ${!n.isRead ? 'bg-orange-50/40' : ''}`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? 'bg-orange-500' : 'bg-slate-300'}`} />
                              <div>
                                <p className="text-sm font-medium text-slate-800">{n.title}</p>
                                {n.message && <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Link href="/dashboard/notifikasi" onClick={() => setNotifOpen(false)}
                        className="block p-3 text-center text-sm text-orange-600 hover:bg-orange-50 transition-all font-medium">
                        Lihat semua notifikasi
                      </Link>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <Link href="/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-all">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-slate-800 leading-tight max-w-24 truncate">{user?.name}</div>
                    <div className={`text-xs ${user?.membership === 'premium' ? 'text-amber-600' : 'text-slate-400'}`}>
                      {user?.membership === 'premium' ? '⭐ Premium' : 'Free'}
                    </div>
                  </div>
                </Link>
                <button onClick={() => { logout(); toast.success('Berhasil logout'); }}
                  className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors px-2 py-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors px-3 py-2">
                  Masuk
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-5">
                  Daftar Gratis
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 bg-white/95 backdrop-blur-md animate-slide-up">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${
                  isActive(link.href) ? 'text-orange-600 bg-orange-50' : 'text-slate-700 hover:bg-slate-50'
                }`}>
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button onClick={() => { logout(); setMenuOpen(false); toast.success('Berhasil logout'); }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all mt-2">
                Keluar
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
