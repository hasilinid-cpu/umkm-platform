'use client';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { notificationAPI } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import toast from 'react-hot-toast';

const TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  course: { icon: '🎓', color: 'bg-blue-100' },
  community: { icon: '👥', color: 'bg-green-100' },
  booking: { icon: '📅', color: 'bg-teal-100' },
  payment: { icon: '💳', color: 'bg-purple-100' },
  system: { icon: '🔔', color: 'bg-orange-100' },
  achievement: { icon: '🏆', color: 'bg-amber-100' },
};

export default function NotifikasiPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery('notifications', () =>
    notificationAPI.getAll().then(r => r.data.data)
  );

  const markReadMutation = useMutation(
    () => notificationAPI.markAllRead(),
    {
      onSuccess: () => {
        qc.invalidateQueries('notifications');
        toast.success('Semua notifikasi ditandai dibaca');
      },
    }
  );

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">🔔 Notifikasi</h1>
          <p className="text-slate-500 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua sudah dibaca'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={() => markReadMutation.mutate()} className="text-sm text-orange-600 hover:underline font-medium">
            Tandai semua dibaca
          </button>
        )}
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 shimmer rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2"><div className="h-4 shimmer rounded w-3/4" /><div className="h-3 shimmer rounded w-1/2" /></div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-5xl mb-4">🔕</div>
            <h3 className="font-bold text-slate-800">Belum ada notifikasi</h3>
            <p className="text-slate-400 text-sm mt-1">Notifikasi akan muncul di sini</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {notifications.map((n: any) => {
              const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
              return (
                <div key={n.id} className={`p-5 hover:bg-slate-50 transition-all ${!n.isRead ? 'bg-orange-50/30' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${config.color} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold ${!n.isRead ? 'text-slate-900' : 'text-slate-700'}`}>{n.title}</p>
                        {!n.isRead && <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1.5" />}
                      </div>
                      {n.message && <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>}
                      <p className="text-xs text-slate-400 mt-1.5">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: id })}
                      </p>
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
