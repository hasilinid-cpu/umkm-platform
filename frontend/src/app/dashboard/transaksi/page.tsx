'use client';
import { useQuery } from 'react-query';
import { paymentAPI } from '@/lib/api';

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  paid: { label: '✓ Dibayar', color: 'bg-green-100 text-green-700' },
  pending: { label: '⏳ Menunggu', color: 'bg-amber-100 text-amber-700' },
  failed: { label: '✗ Gagal', color: 'bg-red-100 text-red-700' },
  refunded: { label: '↩ Refund', color: 'bg-slate-100 text-slate-600' },
};

const TYPE_ICON: Record<string, string> = {
  course: '🎓', product: '📦', membership: '⭐', booking: '📅',
};

export default function TransaksiPage() {
  const { data, isLoading } = useQuery('transactions', () =>
    paymentAPI.getTransactions().then(r => r.data.data.orders)
  );

  const orders = data || [];
  const paid = orders.filter((o: any) => o.status === 'paid');
  const totalSpend = paid.reduce((sum: number, o: any) => sum + parseFloat(o.total), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-display">💳 Riwayat Transaksi</h1>
        <p className="text-slate-500 text-sm mt-1">Semua riwayat pembelian Anda</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Transaksi', value: orders.length, icon: '📋' },
          { label: 'Berhasil', value: paid.length, icon: '✅' },
          { label: 'Total Pengeluaran', value: `Rp ${totalSpend.toLocaleString('id')}`, icon: '💰' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <div className="text-xl mb-2">{s.icon}</div>
            <div className="text-lg font-bold text-slate-900 font-display">{s.value}</div>
            <div className="text-slate-500 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 font-display">Semua Transaksi</h2>
        </div>

        {isLoading ? (
          <div className="p-5 space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 shimmer rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2"><div className="h-4 shimmer rounded w-1/2" /><div className="h-3 shimmer rounded w-1/3" /></div>
                <div className="h-4 shimmer rounded w-24" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-slate-500">Belum ada transaksi</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {orders.map((order: any) => {
              const status = STATUS_CONFIG[order.status] || { label: order.status, color: 'bg-slate-100 text-slate-600' };
              return (
                <div key={order.id} className="p-5 hover:bg-slate-50 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {TYPE_ICON[order.type] || '💳'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{order.items?.[0]?.name || 'Transaksi'}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-slate-400 text-xs">{order.orderNumber}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 text-xs">
                          {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className={`badge text-xs ${status.color}`}>{status.label}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-slate-900">Rp {parseInt(order.total).toLocaleString('id')}</p>
                      <p className="text-slate-400 text-xs capitalize">{order.type}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
