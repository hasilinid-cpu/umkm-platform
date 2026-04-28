'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { communityAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

const CATS = [
  { value: '', label: '🔥 Semua' },
  { value: 'kuliner', label: '🍜 Kuliner' },
  { value: 'fashion', label: '👗 Fashion' },
  { value: 'teknologi', label: '💻 Teknologi' },
  { value: 'pertanian', label: '🌱 Pertanian' },
  { value: 'kerajinan', label: '🎨 Kerajinan' },
  { value: 'jasa', label: '🛠️ Jasa' },
  { value: 'retail', label: '🏪 Retail' },
  { value: 'umum', label: '💬 Umum' },
];

function PostCard({ post, onClick }: { post: any; onClick: () => void }) {
  const cat = CATS.find(c => c.value === post.category);
  return (
    <div onClick={onClick} className="card card-hover p-5 cursor-pointer group">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {post.authorName?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-semibold text-slate-800">{post.authorName}</span>
            {post.isPinned && <span className="badge bg-orange-100 text-orange-700 text-xs">📌 Pinned</span>}
            <span className={`badge text-xs ${cat?.value ? 'bg-slate-100 text-slate-600' : ''}`}>{cat?.label}</span>
          </div>
          <h3 className="font-bold text-slate-900 font-display group-hover:text-orange-600 transition-colors mb-1.5 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 mb-3">{post.content}</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>👍 {post.likeCount}</span>
            <span>💬 {post.commentCount} komentar</span>
            <span>👁 {post.viewCount}</span>
            <span className="ml-auto">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: id })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PostDetail({ postId, onBack }: { postId: string; onBack: () => void }) {
  const [comment, setComment] = useState('');
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery(['post', postId], () =>
    communityAPI.getPost(postId).then(r => r.data.data.post)
  );

  const addCommentMutation = useMutation(
    (content: string) => communityAPI.addComment(postId, { content }),
    {
      onSuccess: () => {
        toast.success('Komentar ditambahkan!');
        setComment('');
        qc.invalidateQueries(['post', postId]);
      },
      onError: () => toast.error('Gagal menambah komentar'),
    }
  );

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push('/login'); return; }
    if (!comment.trim()) return;
    addCommentMutation.mutate(comment.trim());
  };

  if (isLoading) return <div className="p-8 text-center"><span className="text-slate-400">Memuat...</span></div>;

  const cat = CATS.find(c => c.value === data?.category);

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600 transition-colors">
        ← Kembali ke Forum
      </button>

      <div className="card p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {data?.authorName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-slate-800">{data?.authorName}</span>
              <span className={`badge text-xs bg-slate-100 text-slate-600`}>{cat?.label}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display mb-3">{data?.title}</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{data?.content}</p>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-4 pt-4 border-t border-slate-100">
              <span>👍 {data?.likeCount}</span>
              <span>💬 {data?.commentCount} komentar</span>
              <span>👁 {data?.viewCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="card p-6">
        <h3 className="font-bold text-slate-900 font-display mb-5">Komentar ({data?.comments?.length || 0})</h3>

        {/* Add comment */}
        <form onSubmit={handleComment} className="mb-6">
          <div className="flex gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="flex-1">
              <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder={isAuthenticated ? 'Tulis komentar Anda...' : 'Login untuk berkomentar'}
                disabled={!isAuthenticated}
                rows={3}
                className="input-field resize-none text-sm" />
              <div className="flex justify-end mt-2">
                <button type="submit" disabled={!comment.trim() || addCommentMutation.isLoading}
                  className="btn-primary text-sm py-2 px-5">
                  {addCommentMutation.isLoading ? 'Mengirim...' : 'Kirim Komentar'}
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="space-y-4">
          {data?.comments?.map((c: any) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {c.authorName?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-slate-800">{c.authorName}</span>
                  <span className="text-xs text-slate-400">
                    {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true, locale: id })}
                  </span>
                </div>
                <p className="text-sm text-slate-700">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function KomunitasPage() {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'umum' });
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery(
    ['posts', { category, search, page }],
    () => communityAPI.getPosts({ category, search, page, limit: 10 }).then(r => r.data.data)
  );

  const createMutation = useMutation(
    () => communityAPI.createPost(newPost),
    {
      onSuccess: () => {
        toast.success('Diskusi berhasil dibuat! 🎉');
        setShowNewPost(false);
        setNewPost({ title: '', content: '', category: 'umum' });
        qc.invalidateQueries(['posts']);
      },
      onError: () => toast.error('Gagal membuat diskusi'),
    }
  );

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { router.push('/login'); return; }
    createMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block badge bg-green-500/20 border border-green-500/30 text-green-300 mb-4">👥 Komunitas UMKM</div>
          <h1 className="text-4xl font-bold text-white font-display mb-3">
            Ruang Diskusi & <span className="gradient-text">Saling Berbagi</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
            Bergabunglah dengan 10,000+ pengusaha UMKM. Tanya, bagikan, dan bertumbuh bersama!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedPost ? (
          <PostDetail postId={selectedPost} onBack={() => setSelectedPost(null)} />
        ) : (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-5">
              <button onClick={() => { if (!isAuthenticated) { router.push('/login'); return; } setShowNewPost(true); }}
                className="w-full btn-primary justify-center py-3">
                ✍️ Buat Diskusi
              </button>

              <div className="card p-5">
                <h3 className="font-bold text-slate-800 mb-3 font-display">Kategori</h3>
                <div className="space-y-1">
                  {CATS.map(cat => (
                    <button key={cat.value} onClick={() => setCategory(cat.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        category === cat.value ? 'bg-orange-100 text-orange-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-bold text-slate-800 mb-3 font-display">📌 Aturan Forum</h3>
                <ul className="space-y-2 text-xs text-slate-500">
                  {['Bersikap sopan dan saling menghormati', 'Dilarang spam dan iklan berlebihan', 'Informasi yang dishare harus akurat', 'Bagikan pengalaman nyata'].map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-orange-400 mt-0.5">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            {/* Main */}
            <div className="lg:col-span-3">
              {/* New Post Modal */}
              {showNewPost && (
                <div className="card p-6 mb-6 border-2 border-orange-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 font-display">✍️ Buat Diskusi Baru</h3>
                    <button onClick={() => setShowNewPost(false)} className="text-slate-400 hover:text-red-500 text-xl">×</button>
                  </div>
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <input type="text" required value={newPost.title}
                      onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                      placeholder="Judul diskusi Anda..."
                      className="input-field" />
                    <select value={newPost.category}
                      onChange={e => setNewPost(p => ({ ...p, category: e.target.value }))}
                      className="input-field">
                      {CATS.slice(1).map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <textarea required rows={5} value={newPost.content}
                      onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                      placeholder="Ceritakan topik diskusi Anda secara detail..."
                      className="input-field resize-none" />
                    <div className="flex gap-3 justify-end">
                      <button type="button" onClick={() => setShowNewPost(false)} className="btn-secondary text-sm py-2">Batal</button>
                      <button type="submit" disabled={createMutation.isLoading} className="btn-primary text-sm py-2">
                        {createMutation.isLoading ? 'Memposting...' : '🚀 Posting Diskusi'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Search */}
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Cari diskusi..."
                  className="input-field pl-11" />
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="card p-5">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 shimmer rounded-full flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 shimmer rounded w-3/4" />
                          <div className="h-3 shimmer rounded w-full" />
                          <div className="h-3 shimmer rounded w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : data?.posts?.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">💬</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Belum ada diskusi</h3>
                  <p className="text-slate-500">Jadilah yang pertama memulai diskusi!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data?.posts?.map((post: any) => (
                    <PostCard key={post.id} post={post} onClick={() => setSelectedPost(post.id)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
