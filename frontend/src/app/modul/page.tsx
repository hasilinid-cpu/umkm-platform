'use client';
import { useState } from 'react';
import { useQuery } from 'react-query';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { productAPI, paymentAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const CATS = [
  { value: '', label: '🔥 Semua', color: 'bg-slate-100 text-slate-700' },
  { value: 'template', label: '📄 Template', color: 'bg-blue-100 text-blue-700' },
  { value: 'sop', label: '📋 SOP', color: 'bg-green-100 text-green-700' },
  { value: 'excel', label: '📊 Excel', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'ebook', label: '📚 E-Book', color: 'bg-purple-100 text-purple-700' },
  { value: 'presentasi', label: '🎯 Presentasi', color: 'bg-amber-100 text-amber-700' },
];

function ProductCard({ product, onBuy }: { product: any; onBuy: (p: any) => void }) {
  const catInfo = CATS.find(c => c.value === product.category);
  return (
    <div className="card card-hover group">
      <div className="p-6">
        <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
          {product.category === 'template' ? '📄' : product.category === 'sop' ? '📋' :
           product.category === 'excel' ? '📊' : product.category === 'ebook' ? '📚' :
           product.category === 'presentasi' ? '🎯' : '📦'}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className={`badge text-xs ${catInfo?.color}`}>{catInfo?.label}</span>
          {product.isFree && <span className="badge-free text-xs">GRATIS</span>}
          {product.isPremiumOnly && <span className="badge-premium text-xs">⭐ Premium</span>}
        </div>
        <h3 className="font-bold text-slate-900 font-display text-base mb-2 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
          {product.title}
        </h3>
        <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-2">{product.shortDescription}</p>

        {product.features?.length > 0 && (
          <ul className="space-y-1.5 mb-4">
            {product.features.slice(0, 3).map((f: string, i: number) => (
              <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                <span className="text-green-500">✓</span> {f}
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <span>📥 {product.downloadCount?.toLocaleString()} diunduh</span>
          <span>⭐ {product.rating} ({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            {product.isFree ? (
              <span className="text-green-600 font-bold text-lg">Gratis</span>
            ) : (
              <div>
                <span className="text-orange-600 font-bold">Rp {parseInt(product.price).toLocaleString('id')}</span>
                {product.originalPrice > product.price && (
                  <div className="text-slate-400 text-xs line-through">Rp {parseInt(product.originalPrice).toLocaleString('id')}</div>
                )}
              </div>
            )}
          </div>
          <button onClick={() => onBuy(product)}
            className="btn-primary text-xs py-2 px-4">
            {product.isFree ? '📥 Unduh' : '🛒 Beli'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ModulPage() {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const { data, isLoading } = useQuery(
    ['products', { category, search }],
    () => productAPI.getAll({ category, search, limit: 20 }).then(r => r.data.data)
  );

  const handleBuy = async (product: any) => {
    if (!isAuthenticated) { router.push('/login'); return; }

    if (product.isPremiumOnly && user?.membership !== 'premium') {
      toast.error('Produk ini hanya untuk member Premium');
      router.push('/dashboard/membership'); return;
    }

    if (product.isFree) {
      toast.success(`"${product.title}" berhasil diunduh! 📥`); return;
    }

    try {
      const res = await paymentAPI.create({ type: 'product', referenceId: product.id });
      const { order } = res.data.data;
      if (window.confirm(`Total: Rp ${parseInt(product.price).toLocaleString('id')}\n\nSimulasi pembayaran berhasil?\n(Mock payment)`)) {
        await paymentAPI.confirm(order.id);
        toast.success(`Pembelian berhasil! Download akan segera dimulai 🎉`);
      }
    } catch {
      toast.error('Gagal memproses pembayaran');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block badge bg-orange-500/20 border border-orange-500/30 text-orange-300 mb-4">📦 Modul Bisnis</div>
          <h1 className="text-4xl font-bold text-white font-display mb-3">
            Tools & Template untuk <span className="gradient-text">UMKM Profesional</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
            Template bisnis, SOP, Excel keuangan, dan lebih banyak lagi. Unduh dan langsung gunakan!
          </p>
          <div className="max-w-lg mx-auto relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari template, SOP, atau tools..."
              className="w-full pl-11 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm backdrop-blur" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATS.map(cat => (
            <button key={cat.value} onClick={() => setCategory(cat.value)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                category === cat.value
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-orange-50 border border-slate-200'
              }`}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '📦', val: '500+', label: 'Total Produk' },
            { icon: '📥', val: '50K+', label: 'Total Unduhan' },
            { icon: '⭐', val: '4.8', label: 'Rating Rata-rata' },
            { icon: '🆓', val: '50+', label: 'Produk Gratis' },
          ].map((s, i) => (
            <div key={i} className="card p-4 flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <div className="font-bold text-slate-900 font-display">{s.val}</div>
                <div className="text-slate-400 text-xs">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="card p-6">
                <div className="w-14 h-14 shimmer rounded-2xl mb-4" />
                <div className="h-4 shimmer rounded w-3/4 mb-2" />
                <div className="h-3 shimmer rounded w-full mb-1" />
                <div className="h-3 shimmer rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {data?.products?.map((product: any) => (
              <ProductCard key={product.id} product={product} onBuy={handleBuy} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
