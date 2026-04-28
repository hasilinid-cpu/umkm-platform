import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">UI</span>
              </div>
              <div>
                <div className="font-bold text-white text-sm font-display">UMKM Penggerak</div>
                <div className="text-orange-400 text-xs">Indonesia</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5">Ekosistem digital terpadu untuk UMKM Indonesia. Belajar, berkembang, dan bertumbuh bersama.</p>
            <p className="text-xs font-semibold text-orange-400 italic">"UMKM Kuat, Indonesia Maju"</p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-display">Platform</h4>
            <ul className="space-y-3 text-sm">
              {[['Akademi UMKM', '/akademi'], ['Re-Learning', '/relearning'], ['Modul Bisnis', '/modul'], ['Komunitas', '/komunitas'], ['Klinik Bisnis', '/mentor']].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-orange-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-display">Perusahaan</h4>
            <ul className="space-y-3 text-sm">
              {[['Tentang Kami', '/tentang'], ['Karir', '/karir'], ['Blog', '/blog'], ['Kemitraan', '/mitra'], ['Kontak', '/kontak']].map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-orange-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 className="text-white font-semibold mb-4 font-display">Hubungi Kami</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><span>📧</span> info@umkmpengerak.id</li>
              <li className="flex items-center gap-2"><span>📱</span> +62 811-1234-5678</li>
              <li className="flex items-center gap-2"><span>🏢</span> Jakarta, Indonesia</li>
            </ul>
            <div className="mt-5 flex gap-3">
              {['instagram', 'facebook', 'youtube', 'tiktok'].map(social => (
                <a key={social} href="#" className="w-9 h-9 bg-slate-800 hover:bg-orange-600 rounded-xl flex items-center justify-center transition-all text-slate-400 hover:text-white text-xs font-bold uppercase">
                  {social.charAt(0).toUpperCase()}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {year} UMKM Penggerak Indonesia. Hak cipta dilindungi.</p>
          <div className="flex gap-5">
            <Link href="/privasi" className="hover:text-orange-400 transition-colors">Kebijakan Privasi</Link>
            <Link href="/syarat" className="hover:text-orange-400 transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
