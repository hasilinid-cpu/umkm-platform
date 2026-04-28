'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { courseAPI, paymentAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function CourseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('kurikulum');
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery(['course', slug], () =>
    courseAPI.getOne(slug).then(r => r.data.data)
  );

  const enrollMutation = useMutation(
    () => courseAPI.enroll(data?.course?.id),
    {
      onSuccess: () => {
        toast.success('Berhasil mendaftar kursus! 🎉');
        qc.invalidateQueries(['course', slug]);
      },
      onError: (err: any) => {
        if (err.response?.data?.requiresPayment) {
          handlePayment();
        } else if (err.response?.data?.requiresPremium) {
          toast.error('Kursus ini memerlukan membership Premium');
          router.push('/dashboard/membership');
        } else {
          toast.error(err.response?.data?.message || 'Gagal mendaftar kursus');
        }
      },
    }
  );

  const handlePayment = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    try {
      const res = await paymentAPI.create({ type: 'course', referenceId: data?.course?.id });
      const { order, payment } = res.data.data;
      if (window.confirm(`Total: Rp ${parseInt(data?.course?.price).toLocaleString('id')}\n\nSimulasi pembayaran berhasil?\n(Ini adalah mock payment)`)) {
        await paymentAPI.confirm(order.id);
        toast.success('Pembayaran berhasil! Selamat belajar 🎓');
        qc.invalidateQueries(['course', slug]);
      }
    } catch {
      toast.error('Gagal memproses pembayaran');
    }
  };

  const handleEnroll = () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    enrollMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video shimmer rounded-2xl" />
              <div className="h-8 shimmer rounded w-3/4" />
              <div className="h-4 shimmer rounded w-full" />
            </div>
            <div className="h-80 shimmer rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const { course, isEnrolled, enrollment } = data || {};

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
            <Link href="/akademi" className="hover:text-orange-400">Akademi</Link>
            <span>›</span>
            <span className="capitalize text-slate-500">{course?.category}</span>
            <span>›</span>
            <span className="text-slate-300 line-clamp-1">{course?.title}</span>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap gap-2 mb-3">
                {course?.isFree && <span className="badge-free">GRATIS</span>}
                {course?.isPremiumOnly && <span className="badge-premium">⭐ Premium</span>}
                <span className="badge bg-white/10 text-slate-300 capitalize">{course?.category}</span>
                <span className="badge bg-white/10 text-slate-300 capitalize">{course?.level}</span>
              </div>
              <h1 className="text-3xl font-bold text-white font-display mb-3">{course?.title}</h1>
              <p className="text-slate-300 text-base mb-5">{course?.shortDescription}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-1.5">⭐ <span className="text-amber-400 font-bold">{course?.rating}</span> ({course?.reviewCount?.toLocaleString()} ulasan)</span>
                <span>👥 {course?.enrollmentCount?.toLocaleString()} siswa</span>
                <span>📹 {course?.totalLessons} video</span>
                <span>⏱️ {Math.floor(course?.totalDuration / 60)}j {course?.totalDuration % 60}m</span>
              </div>
              <div className="flex items-center gap-2 mt-4 text-slate-300 text-sm">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {course?.mentorName?.charAt(0)}
                </div>
                Oleh <span className="text-orange-400 font-medium">{course?.mentorName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="card overflow-hidden">
              {activeLesson?.videoUrl ? (
                <div className="aspect-video bg-black">
                  <iframe src={activeLesson.videoUrl} className="w-full h-full" allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">🎬</div>
                    <h3 className="text-white font-display font-bold text-xl mb-2">
                      {isEnrolled ? 'Pilih video untuk mulai belajar' : 'Daftar untuk akses semua video'}
                    </h3>
                    {!isEnrolled && (
                      <button onClick={handleEnroll} className="btn-primary mt-3">
                        {course?.isFree ? '🚀 Daftar Gratis' : `💳 Beli Kursus – Rp ${parseInt(course?.price || 0).toLocaleString('id')}`}
                      </button>
                    )}
                  </div>
                </div>
              )}
              {activeLesson && (
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 font-display">{activeLesson.title}</h3>
                  {activeLesson.description && <p className="text-slate-500 text-sm mt-1">{activeLesson.description}</p>}
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="card overflow-hidden">
              <div className="flex border-b border-slate-100 overflow-x-auto">
                {['kurikulum', 'tentang', 'instruktur'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 text-sm font-medium transition-all capitalize whitespace-nowrap ${
                      activeTab === tab ? 'text-orange-600 border-b-2 border-orange-600' : 'text-slate-500 hover:text-slate-800'
                    }`}>
                    {tab === 'kurikulum' ? '📚 Kurikulum' : tab === 'tentang' ? 'ℹ️ Tentang' : '👨‍🏫 Instruktur'}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'kurikulum' && (
                  <div>
                    <p className="text-slate-500 text-sm mb-4">{course?.totalLessons} video • {Math.floor(course?.totalDuration / 60)}j {course?.totalDuration % 60}m total</p>
                    <div className="space-y-2">
                      {course?.lessons?.map((lesson: any, i: number) => {
                        const canWatch = isEnrolled || lesson.isFreePreview;
                        return (
                          <div key={lesson.id}
                            onClick={() => canWatch && setActiveLesson(lesson)}
                            className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                              canWatch ? 'hover:bg-orange-50 cursor-pointer' : 'opacity-60 cursor-not-allowed'
                            } ${activeLesson?.id === lesson.id ? 'bg-orange-50 border border-orange-200' : 'bg-slate-50'}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              enrollment?.completedLessons?.includes(lesson.id) ? 'bg-green-100 text-green-600' :
                              activeLesson?.id === lesson.id ? 'bg-orange-600 text-white' : 'bg-white text-slate-500 border border-slate-200'
                            }`}>
                              {enrollment?.completedLessons?.includes(lesson.id) ? '✓' : String(i + 1).padStart(2, '0')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">{lesson.title}</p>
                              {lesson.sectionTitle && <p className="text-xs text-slate-400">{lesson.sectionTitle}</p>}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {lesson.isFreePreview && <span className="badge-free text-xs">Gratis</span>}
                              {!canWatch && <span className="text-slate-400 text-xs">🔒</span>}
                              <span className="text-xs text-slate-400">{lesson.duration}m</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'tentang' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-3 font-display">Deskripsi Kursus</h4>
                      <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{course?.description}</p>
                    </div>
                    {course?.objectives?.length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-900 mb-3 font-display">Yang Akan Anda Pelajari</h4>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {course.objectives.map((obj: string, i: number) => (
                            <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <span className="text-green-500 mt-0.5">✓</span> {obj}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {course?.requirements?.length > 0 && (
                      <div>
                        <h4 className="font-bold text-slate-900 mb-3 font-display">Persyaratan</h4>
                        <ul className="space-y-1">
                          {course.requirements.map((req: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                              <span className="text-orange-400 mt-0.5">•</span> {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'instruktur' && (
                  <div className="flex gap-5">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                      {course?.mentorName?.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 font-display text-lg">{course?.mentorName}</h4>
                      <p className="text-orange-600 text-sm mb-3">Business Coach & Educator</p>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        Mentor berpengalaman di bidang bisnis dan kewirausahaan dengan track record membantu ratusan UMKM berkembang.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              {isEnrolled ? (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 text-center">
                    <span className="text-2xl mb-2 block">🎓</span>
                    <p className="text-green-800 font-semibold text-sm">Anda sudah terdaftar!</p>
                    <p className="text-green-600 text-xs mt-0.5">Progress: {enrollment?.progress || 0}% selesai</p>
                  </div>
                  {/* Progress bar */}
                  <div className="mb-5">
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                      <span>Progress Belajar</span>
                      <span>{enrollment?.progress || 0}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all"
                        style={{ width: `${enrollment?.progress || 0}%` }} />
                    </div>
                  </div>
                  <button onClick={() => setActiveLesson(course?.lessons?.[0])}
                    className="w-full btn-primary justify-center">
                    {enrollment?.progress ? '▶ Lanjutkan Belajar' : '🚀 Mulai Belajar'}
                  </button>
                </>
              ) : (
                <>
                  <div className="text-center mb-5">
                    {course?.isFree ? (
                      <div className="text-3xl font-bold text-green-600 font-display">Gratis!</div>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-orange-600 font-display">
                          Rp {parseInt(course?.price || 0).toLocaleString('id')}
                        </div>
                        {course?.originalPrice > course?.price && (
                          <div className="text-slate-400 text-sm line-through">
                            Rp {parseInt(course?.originalPrice || 0).toLocaleString('id')}
                          </div>
                        )}
                        {course?.originalPrice > course?.price && (
                          <div className="badge bg-red-100 text-red-700 mt-1 mx-auto">
                            Hemat {Math.round((1 - course?.price / course?.originalPrice) * 100)}%
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <button onClick={handleEnroll} disabled={enrollMutation.isLoading}
                    className="w-full btn-primary justify-center py-3.5 text-base shadow-glow mb-3">
                    {enrollMutation.isLoading ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
                    ) : course?.isFree ? '🚀 Daftar Gratis Sekarang' : '💳 Beli Kursus Ini'}
                  </button>
                  <p className="text-center text-slate-400 text-xs">Garansi uang kembali 30 hari</p>
                </>
              )}

              <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
                {[
                  { icon: '📹', text: `${course?.totalLessons} video pembelajaran` },
                  { icon: '⏱️', text: `${Math.floor(course?.totalDuration / 60)}j ${course?.totalDuration % 60}m durasi` },
                  { icon: '📱', text: 'Akses mobile & desktop' },
                  { icon: '♾️', text: 'Akses seumur hidup' },
                  { icon: '🏆', text: 'Sertifikat penyelesaian' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                    <span>{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
