require('dotenv').config();
const { connectDB } = require('../config/database');
const User = require('../models/User');
const { Course, Lesson, Enrollment } = require('../models/Course');
const { Product, Post, Mentor, Notification } = require('../models/index');

const seed = async () => {
  await connectDB();
  console.log('🌱 Starting database seeding...');

  // Clear tables
  await Notification.destroy({ where: {} });
  await Enrollment.destroy({ where: {} });
  await Lesson.destroy({ where: {} });
  await Course.destroy({ where: {} });
  await Product.destroy({ where: {} });
  await Post.destroy({ where: {} });
  await Mentor.destroy({ where: {} });
  await User.destroy({ where: {} });

  // ==================== USERS ====================
  const adminUser = await User.create({
    name: 'Admin UMKM', email: 'admin@umkmpengerak.id', password: 'Admin123!',
    role: 'admin', membership: 'premium', isVerified: true,
    businessName: 'UMKM Penggerak Indonesia',
  });

  const mentorUser = await User.create({
    name: 'Budi Santoso', email: 'budi@umkmpengerak.id', password: 'Budi123!',
    role: 'mentor', membership: 'premium', isVerified: true,
    businessName: 'Santoso Consulting',
    bio: 'Expert bisnis digital dan pemasaran online selama 10 tahun',
  });

  const freeUser = await User.create({
    name: 'Siti Rahayu', email: 'siti@example.com', password: 'Siti123!',
    role: 'user', membership: 'free', isVerified: true,
    businessName: 'Warung Siti', businessType: 'Kuliner', city: 'Jakarta',
  });

  const premiumUser = await User.create({
    name: 'Andi Wijaya', email: 'andi@example.com', password: 'Andi123!',
    role: 'user', membership: 'premium', isVerified: true,
    membershipExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    businessName: 'Batik Andi', businessType: 'Fashion', city: 'Yogyakarta',
  });

  console.log('✅ Users created');

  // ==================== COURSES ====================
  const courses = await Course.bulkCreate([
    {
      title: 'Digital Marketing untuk UMKM Pemula',
      slug: 'digital-marketing-umkm-pemula',
      description: 'Pelajari strategi pemasaran digital yang efektif untuk mengembangkan bisnis UMKM Anda. Dari media sosial, SEO, hingga iklan berbayar.',
      shortDescription: 'Kuasai digital marketing dari nol hingga mahir',
      category: 'marketing', level: 'pemula',
      price: 299000, originalPrice: 499000, isFree: false, isPremiumOnly: false,
      mentorId: mentorUser.id, mentorName: 'Budi Santoso',
      totalDuration: 480, totalLessons: 12,
      enrollmentCount: 1247, rating: 4.8, reviewCount: 312,
      tags: ['digital marketing', 'media sosial', 'instagram', 'facebook'],
      objectives: ['Memahami strategi digital marketing', 'Membuat konten yang menarik', 'Mengelola iklan Facebook & Instagram', 'Mengukur ROI kampanye'],
      requirements: ['Memiliki smartphone atau laptop', 'Akun media sosial aktif'],
      isPublished: true, publishedAt: new Date(), featuredOrder: 1,
    },
    {
      title: 'Manajemen Keuangan UMKM: Dari Chaos ke Terstruktur',
      slug: 'manajemen-keuangan-umkm',
      description: 'Kelola keuangan bisnis dengan benar. Belajar pembukuan sederhana, analisis cashflow, dan strategi mengatur modal usaha.',
      shortDescription: 'Atur keuangan bisnis Anda dengan sistematis',
      category: 'keuangan', level: 'pemula',
      price: 249000, originalPrice: 399000, isFree: false, isPremiumOnly: false,
      mentorId: mentorUser.id, mentorName: 'Budi Santoso',
      totalDuration: 360, totalLessons: 10,
      enrollmentCount: 892, rating: 4.7, reviewCount: 198,
      tags: ['keuangan', 'pembukuan', 'cashflow', 'akuntansi'],
      objectives: ['Membuat laporan keuangan sederhana', 'Mengelola cashflow bisnis', 'Memahami pajak UMKM'],
      isPublished: true, publishedAt: new Date(), featuredOrder: 2,
    },
    {
      title: 'Strategi Ekspor untuk UMKM Indonesia',
      slug: 'strategi-ekspor-umkm-indonesia',
      description: 'Panduan lengkap untuk UMKM yang ingin memasuki pasar ekspor. Regulasi, dokumentasi, hingga strategi penetrasi pasar internasional.',
      shortDescription: 'Wujudkan impian ekspor produk UMKM Anda',
      category: 'ekspor', level: 'menengah',
      price: 0, isFree: true, isPremiumOnly: false,
      mentorId: mentorUser.id, mentorName: 'Budi Santoso',
      totalDuration: 240, totalLessons: 8,
      enrollmentCount: 2341, rating: 4.9, reviewCount: 541,
      tags: ['ekspor', 'pasar internasional', 'regulasi', 'perdagangan'],
      isPublished: true, publishedAt: new Date(), featuredOrder: 3,
    },
    {
      title: 'Branding & Identitas Bisnis UMKM',
      slug: 'branding-identitas-bisnis-umkm',
      description: 'Bangun brand yang kuat dan berkesan. Pelajari logo, identitas visual, brand story, dan cara membangun kepercayaan pelanggan.',
      shortDescription: 'Buat brand UMKM yang tak terlupakan',
      category: 'marketing', level: 'pemula',
      price: 199000, originalPrice: 350000, isFree: false, isPremiumOnly: true,
      mentorId: mentorUser.id, mentorName: 'Budi Santoso',
      totalDuration: 300, totalLessons: 9,
      enrollmentCount: 654, rating: 4.6, reviewCount: 143,
      tags: ['branding', 'logo', 'identitas visual', 'brand story'],
      isPublished: true, publishedAt: new Date(), featuredOrder: 4,
    },
    {
      title: 'Operasional & SOP Bisnis yang Efisien',
      slug: 'operasional-sop-bisnis-efisien',
      description: 'Bangun sistem operasional yang efisien dengan SOP yang jelas. Tingkatkan produktivitas dan kurangi kesalahan operasional.',
      shortDescription: 'Buat bisnis berjalan autopilot dengan SOP',
      category: 'operasional', level: 'menengah',
      price: 349000, originalPrice: 550000, isFree: false, isPremiumOnly: true,
      mentorId: mentorUser.id, mentorName: 'Budi Santoso',
      totalDuration: 420, totalLessons: 14,
      enrollmentCount: 431, rating: 4.8, reviewCount: 89,
      tags: ['SOP', 'operasional', 'produktivitas', 'manajemen'],
      isPublished: true, publishedAt: new Date(), featuredOrder: 5,
    },
    {
      title: 'E-Commerce Marketplace: Tokopedia & Shopee Mastery',
      slug: 'ecommerce-marketplace-mastery',
      description: 'Optimalkan toko online Anda di Tokopedia dan Shopee. Teknik SEO marketplace, pengelolaan stok, dan strategi promosi efektif.',
      shortDescription: 'Dominasi penjualan di marketplace Indonesia',
      category: 'digital', level: 'pemula',
      price: 279000, originalPrice: 450000, isFree: false, isPremiumOnly: false,
      mentorId: mentorUser.id, mentorName: 'Budi Santoso',
      totalDuration: 390, totalLessons: 11,
      enrollmentCount: 1876, rating: 4.9, reviewCount: 428,
      tags: ['tokopedia', 'shopee', 'e-commerce', 'marketplace'],
      isPublished: true, publishedAt: new Date(), featuredOrder: 6,
    },
  ]);

  // Create lessons for first course
  await Lesson.bulkCreate([
    { courseId: courses[0].id, title: 'Pengenalan Digital Marketing', duration: 45, order: 1, sectionTitle: 'Dasar-Dasar', isFreePreview: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isPublished: true },
    { courseId: courses[0].id, title: 'Memahami Target Audiens', duration: 40, order: 2, sectionTitle: 'Dasar-Dasar', isFreePreview: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isPublished: true },
    { courseId: courses[0].id, title: 'Instagram Marketing Strategy', duration: 50, order: 3, sectionTitle: 'Media Sosial', isFreePreview: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isPublished: true },
    { courseId: courses[0].id, title: 'Facebook & Meta Ads', duration: 55, order: 4, sectionTitle: 'Paid Advertising', isFreePreview: false, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isPublished: true },
    { courseId: courses[0].id, title: 'Google My Business untuk UMKM', duration: 35, order: 5, sectionTitle: 'SEO & Local', isFreePreview: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', isPublished: true },
  ]);

  console.log('✅ Courses & Lessons created');

  // ==================== PRODUCTS ====================
  await Product.bulkCreate([
    {
      title: 'Template Bisnis Plan UMKM Lengkap',
      slug: 'template-bisnis-plan-umkm',
      description: 'Template bisnis plan profesional untuk UMKM. Dilengkapi analisis SWOT, proyeksi keuangan, dan strategi pemasaran. Format Word & Excel.',
      shortDescription: '50+ halaman template bisnis plan siap pakai',
      category: 'template', price: 89000, originalPrice: 150000,
      isFree: false, isPremiumOnly: false,
      sellerId: adminUser.id, sellerName: 'Admin UMKM',
      downloadCount: 1247, rating: 4.8, reviewCount: 234,
      tags: ['bisnis plan', 'template', 'UMKM', 'word'],
      features: ['50+ halaman komprehensif', 'Analisis SWOT otomatis', 'Proyeksi keuangan 3 tahun', 'Template pitch deck'],
      isPublished: true,
    },
    {
      title: 'Excel Keuangan UMKM All-in-One',
      slug: 'excel-keuangan-umkm',
      description: 'Spreadsheet Excel lengkap untuk mengelola keuangan UMKM. Cashflow, laba rugi, neraca, dan laporan keuangan otomatis.',
      shortDescription: 'Kelola keuangan bisnis dengan mudah',
      category: 'excel', price: 69000, originalPrice: 120000,
      isFree: false, isPremiumOnly: false,
      sellerId: adminUser.id, sellerName: 'Admin UMKM',
      downloadCount: 2134, rating: 4.9, reviewCount: 456,
      tags: ['excel', 'keuangan', 'cashflow', 'laporan'],
      features: ['Dashboard keuangan otomatis', 'Laporan laba-rugi', 'Manajemen stok', 'Pengingat tagihan'],
      isPublished: true,
    },
    {
      title: 'SOP Operasional Restoran & Warung Makan',
      slug: 'sop-restoran-warung-makan',
      description: 'Paket SOP lengkap untuk operasional restoran dan warung makan. Dari pembukaan toko hingga penutupan, standar kebersihan, dan pelayanan pelanggan.',
      shortDescription: 'SOP siap pakai untuk bisnis kuliner Anda',
      category: 'sop', price: 129000, originalPrice: 250000,
      isFree: false, isPremiumOnly: false,
      sellerId: adminUser.id, sellerName: 'Admin UMKM',
      downloadCount: 876, rating: 4.7, reviewCount: 187,
      tags: ['SOP', 'restoran', 'kuliner', 'operasional'],
      features: ['15+ dokumen SOP', 'Checklist harian', 'Standar pelayanan', 'Training guide karyawan'],
      isPublished: true,
    },
    {
      title: 'Panduan Ekspor Produk UMKM ke ASEAN',
      slug: 'panduan-ekspor-asean',
      description: 'E-book komprehensif panduan ekspor produk UMKM ke negara-negara ASEAN. Regulasi, dokumen, dan strategi penetrasi pasar.',
      shortDescription: 'Langkah-langkah ekspor ke ASEAN',
      category: 'ebook', price: 0, isFree: true,
      sellerId: adminUser.id, sellerName: 'Admin UMKM',
      downloadCount: 3421, rating: 4.8, reviewCount: 678,
      tags: ['ekspor', 'ASEAN', 'ebook', 'panduan'],
      features: ['120 halaman panduan lengkap', 'Daftar regulasi per negara', 'Template dokumen ekspor', 'Contact list agen ekspor'],
      isPublished: true,
    },
    {
      title: 'Template Presentasi Pitch Investor',
      slug: 'template-presentasi-pitch-investor',
      description: 'Template PowerPoint pitch deck profesional untuk presentasi ke investor. Desain modern, struktur terstruktur, 20 slide siap edit.',
      shortDescription: 'Impress investor dengan pitch deck profesional',
      category: 'presentasi', price: 149000, originalPrice: 280000,
      isFree: false, isPremiumOnly: true,
      sellerId: adminUser.id, sellerName: 'Admin UMKM',
      downloadCount: 543, rating: 4.9, reviewCount: 98,
      tags: ['presentasi', 'investor', 'pitch deck', 'powerpoint'],
      features: ['20 slide template', 'Font premium termasuk', '3 pilihan warna', 'Panduan isi konten'],
      isPublished: true,
    },
  ]);

  console.log('✅ Products created');

  // ==================== COMMUNITY POSTS ====================
  await Post.bulkCreate([
    {
      authorId: premiumUser.id, authorName: 'Andi Wijaya',
      title: 'Tips Meningkatkan Penjualan Batik di Marketplace - Pengalaman Pribadi',
      content: 'Halo teman-teman UMKM! Saya ingin berbagi pengalaman saya dalam meningkatkan penjualan batik di Tokopedia dan Shopee. Setelah mencoba berbagai strategi selama 6 bulan, akhirnya saya berhasil meningkatkan omzet 3x lipat. Berikut tips yang berhasil untuk saya:\n\n1. Foto produk berkualitas tinggi dengan background putih\n2. Deskripsi produk yang detail dengan keyword yang tepat\n3. Aktif di jam prime time (12:00-13:00 dan 19:00-21:00)\n4. Manfaatkan fitur flash sale platform\n5. Respon cepat kurang dari 5 menit\n\nSemoga membantu!',
      category: 'fashion',
      tags: ['marketplace', 'batik', 'tips jualan', 'tokopedia'],
      likeCount: 47, commentCount: 12, viewCount: 234, isPinned: false, isActive: true,
    },
    {
      authorId: freeUser.id, authorName: 'Siti Rahayu',
      title: 'Pengalaman Pertama Ikut Pameran UMKM - Banyak Pelajaran!',
      content: 'Baru saja selesai ikut pameran UMKM Kuliner se-Jakarta! Ini pengalaman pertama saya dan ternyata banyak sekali yang bisa dipelajari. Ada yang sudah pernah ikut pameran? Mau tanya-tanya tentang persiapannya dong...',
      category: 'kuliner',
      tags: ['pameran', 'kuliner', 'pengalaman'],
      likeCount: 23, commentCount: 8, viewCount: 156, isPinned: false, isActive: true,
    },
    {
      authorId: adminUser.id, authorName: 'Admin UMKM',
      title: '📢 [PENTING] Tips Menghadapi Kenaikan Bahan Baku - Strategi UMKM Tangguh',
      content: 'Di tengah situasi kenaikan harga bahan baku, UMKM harus lebih cerdas dalam mengelola bisnis. Berikut strategi yang bisa diterapkan:\n\n**1. Diversifikasi Supplier**\nJangan bergantung pada satu supplier. Cari minimal 3 supplier alternatif.\n\n**2. Beli Stok Lebih Awal**\nJika punya modal, beli stok ketika harga rendah.\n\n**3. Efisiensi Proses**\nReview proses produksi untuk mengurangi pemborosan.\n\n**4. Review Harga Jual**\nJangan takut menyesuaikan harga jika diperlukan.\n\nShare pengalaman Anda di kolom komentar!',
      category: 'umum',
      tags: ['tips bisnis', 'kenaikan harga', 'strategi'],
      likeCount: 89, commentCount: 24, viewCount: 567, isPinned: true, isActive: true,
    },
  ]);

  console.log('✅ Community posts created');

  // ==================== MENTORS ====================
  await Mentor.bulkCreate([
    {
      userId: mentorUser.id,
      name: 'Budi Santoso, MBA',
      title: 'Business Strategist & Digital Marketing Expert',
      bio: 'Lebih dari 10 tahun pengalaman membantu 500+ UMKM Indonesia berkembang. Spesialisasi di digital marketing, brand building, dan strategi ekspansi bisnis.',
      specializations: ['Digital Marketing', 'Brand Strategy', 'Business Development', 'E-Commerce'],
      experience: 10, sessionPrice: 350000,
      rating: 4.9, totalSessions: 342, isAvailable: true,
      availability: {
        senin: ['09:00', '10:00', '14:00', '15:00'],
        selasa: ['09:00', '11:00', '14:00'],
        rabu: ['10:00', '14:00', '16:00'],
        kamis: ['09:00', '10:00', '11:00'],
        jumat: ['09:00', '14:00'],
      },
    },
    {
      userId: adminUser.id,
      name: 'Dr. Rina Kusuma',
      title: 'Ahli Keuangan & Investasi UMKM',
      bio: 'Doktor ekonomi dari UI dengan spesialisasi keuangan mikro. Telah membantu ratusan UMKM mendapatkan akses pembiayaan dan mengelola keuangan secara profesional.',
      specializations: ['Manajemen Keuangan', 'Akses Permodalan', 'Investasi', 'Pajak UMKM'],
      experience: 12, sessionPrice: 400000,
      rating: 4.8, totalSessions: 287, isAvailable: true,
      availability: {
        senin: ['10:00', '13:00', '15:00'],
        rabu: ['10:00', '13:00'],
        jumat: ['10:00', '13:00', '15:00'],
      },
    },
    {
      userId: premiumUser.id,
      name: 'Hendra Gunawan',
      title: 'E-Commerce & Marketplace Specialist',
      bio: 'Praktisi e-commerce dengan pengalaman mengelola toko online dengan omzet miliaran rupiah. Mentor terpercaya untuk UMKM yang ingin sukses di marketplace.',
      specializations: ['Tokopedia', 'Shopee', 'Lazada', 'TikTok Shop', 'Logistics'],
      experience: 8, sessionPrice: 300000,
      rating: 4.7, totalSessions: 198, isAvailable: true,
      availability: {
        selasa: ['14:00', '15:00', '16:00'],
        kamis: ['14:00', '15:00'],
        sabtu: ['10:00', '11:00', '13:00', '14:00'],
      },
    },
  ]);

  console.log('✅ Mentors created');

  // ==================== ENROLLMENTS ====================
  await Enrollment.bulkCreate([
    { userId: premiumUser.id, courseId: courses[0].id, progress: 65, completedLessons: [courses[0].id], lastAccessedAt: new Date() },
    { userId: premiumUser.id, courseId: courses[1].id, progress: 30, completedLessons: [], lastAccessedAt: new Date() },
    { userId: freeUser.id, courseId: courses[2].id, progress: 100, status: 'completed', completedAt: new Date() },
  ]);

  console.log('✅ Enrollments created');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('Admin:   admin@umkmpengerak.id / Admin123!');
  console.log('Mentor:  budi@umkmpengerak.id  / Budi123!');
  console.log('Premium: andi@example.com      / Andi123!');
  console.log('Free:    siti@example.com      / Siti123!\n');

  process.exit(0);
};

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
