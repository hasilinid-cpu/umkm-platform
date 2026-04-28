const { Product, Order, Post, Comment, Mentor, Booking, Notification } = require('../models/index');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

// ==================== MARKETPLACE ====================
exports.getProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const where = { isPublished: true };
    if (category) where.category = category;
    if (search) where.title = { [Op.iLike]: `%${search}%` };

    const { count, rows } = await Product.findAndCountAll({
      where, order: [['createdAt', 'DESC']],
      limit: parseInt(limit), offset: (page - 1) * limit,
    });

    res.json({ success: true, data: { products: rows, total: count } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil produk' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ where: { slug: req.params.slug, isPublished: true } });
    if (!product) return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });

    let purchased = false;
    if (req.user) {
      const order = await Order.findOne({
        where: { userId: req.user.id, status: 'paid', referenceId: product.id },
      });
      purchased = !!order;
    }

    const data = { ...product.toJSON(), fileUrl: purchased || product.isFree ? product.fileUrl : null };
    res.json({ success: true, data: { product: data, purchased } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil produk' });
  }
};

// ==================== PAYMENT (MOCK) ====================
exports.createPayment = async (req, res) => {
  try {
    const { type, referenceId, paymentMethod = 'transfer' } = req.body;

    let amount = 0;
    let items = [];
    let title = '';

    if (type === 'membership') {
      const plan = req.body.plan; // monthly or yearly
      amount = plan === 'yearly' ? 588000 : 59000;
      title = `Membership Premium ${plan === 'yearly' ? 'Tahunan' : 'Bulanan'}`;
      items = [{ id: 'membership', name: title, price: amount, qty: 1 }];
    } else if (type === 'course') {
      const { Course } = require('../models/Course');
      const course = await Course.findByPk(referenceId);
      if (!course) return res.status(404).json({ success: false, message: 'Kursus tidak ditemukan' });
      amount = parseFloat(course.price);
      title = course.title;
      items = [{ id: course.id, name: course.title, price: amount, qty: 1 }];
    } else if (type === 'product') {
      const product = await Product.findByPk(referenceId);
      if (!product) return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
      amount = parseFloat(product.price);
      title = product.title;
      items = [{ id: product.id, name: product.title, price: amount, qty: 1 }];
    } else if (type === 'booking') {
      const booking = await Booking.findByPk(referenceId);
      if (!booking) return res.status(404).json({ success: false, message: 'Booking tidak ditemukan' });
      amount = parseFloat(booking.amount);
      title = `Sesi Konsultasi - ${booking.mentorName}`;
      items = [{ id: booking.id, name: title, price: amount, qty: 1 }];
    }

    const orderNumber = `UMKM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const order = await Order.create({
      orderNumber,
      userId: req.user.id,
      items,
      subtotal: amount,
      total: amount,
      status: 'pending',
      paymentMethod,
      type,
      referenceId,
    });

    // Mock payment gateway response
    const mockPaymentData = {
      orderId: order.id,
      orderNumber,
      amount,
      paymentUrl: `https://pay.mockgateway.test/order/${orderNumber}`,
      qrisCode: type === 'transfer' ? null : `data:image/png;base64,mockQRIS==`,
      virtualAccount: paymentMethod === 'va' ? `1234567890${Math.floor(Math.random() * 10000)}` : null,
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    res.json({ success: true, message: 'Pembayaran berhasil dibuat', data: { order, payment: mockPaymentData } });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ success: false, message: 'Gagal membuat pembayaran' });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ where: { id: orderId, userId: req.user.id } });
    if (!order) return res.status(404).json({ success: false, message: 'Order tidak ditemukan' });
    if (order.status === 'paid') return res.json({ success: true, message: 'Pembayaran sudah dikonfirmasi' });

    await order.update({ status: 'paid', paidAt: new Date() });

    // Process based on type
    if (order.type === 'membership') {
      const plan = order.items[0]?.name?.includes('Tahunan') ? 'yearly' : 'monthly';
      const expiresAt = new Date();
      plan === 'yearly' ? expiresAt.setFullYear(expiresAt.getFullYear() + 1) : expiresAt.setMonth(expiresAt.getMonth() + 1);
      await req.user.update({ membership: 'premium', membershipExpiresAt: expiresAt });
    } else if (order.type === 'course') {
      const { Enrollment } = require('../models/Course');
      await Enrollment.create({ userId: req.user.id, courseId: order.referenceId, paymentAmount: order.total });
    } else if (order.type === 'booking') {
      await Booking.update({ paymentStatus: 'paid', status: 'confirmed' }, { where: { id: order.referenceId } });
    }

    await Notification.create({
      userId: req.user.id,
      type: 'payment',
      title: 'Pembayaran Berhasil ✅',
      message: `Pembayaran untuk ${order.items[0]?.name} telah dikonfirmasi`,
      data: { orderId: order.id },
    });

    res.json({ success: true, message: 'Pembayaran berhasil dikonfirmasi', data: { order } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal konfirmasi pembayaran' });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, data: { orders } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat transaksi' });
  }
};

// ==================== COMMUNITY ====================
exports.getPosts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const where = { isActive: true };
    if (category) where.category = category;
    if (search) where.title = { [Op.iLike]: `%${search}%` };

    const { count, rows } = await Post.findAndCountAll({
      where, order: [['isPinned', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit), offset: (page - 1) * limit,
    });

    res.json({ success: true, data: { posts: rows, total: count } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil diskusi' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const post = await Post.create({
      title, content, category, tags,
      authorId: req.user.id, authorName: req.user.name, authorAvatar: req.user.avatar,
    });
    res.status(201).json({ success: true, data: { post } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat diskusi' });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id, isActive: true },
      include: [{ model: Comment, as: 'comments', where: { isActive: true }, required: false, order: [['createdAt', 'ASC']] }],
    });
    if (!post) return res.status(404).json({ success: false, message: 'Diskusi tidak ditemukan' });
    await post.increment('viewCount');
    res.json({ success: true, data: { post } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil diskusi' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content, parentId } = req.body;
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Diskusi tidak ditemukan' });

    const comment = await Comment.create({
      postId: req.params.id, content, parentId: parentId || null,
      authorId: req.user.id, authorName: req.user.name, authorAvatar: req.user.avatar,
    });
    await post.increment('commentCount');
    res.status(201).json({ success: true, data: { comment } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal menambahkan komentar' });
  }
};

// ==================== MENTORING ====================
exports.getMentors = async (req, res) => {
  try {
    const { specialization, search } = req.query;
    const where = { isAvailable: true };
    if (search) where.name = { [Op.iLike]: `%${search}%` };

    const mentors = await Mentor.findAll({ where, order: [['rating', 'DESC']] });
    res.json({ success: true, data: { mentors } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data mentor' });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { mentorId, scheduledAt, duration, topic, description } = req.body;
    const mentor = await Mentor.findByPk(mentorId);
    if (!mentor) return res.status(404).json({ success: false, message: 'Mentor tidak ditemukan' });

    const booking = await Booking.create({
      userId: req.user.id, mentorId,
      mentorName: mentor.name, scheduledAt, duration: duration || 60,
      topic, description,
      amount: parseFloat(mentor.sessionPrice),
    });

    res.status(201).json({ success: true, message: 'Booking berhasil dibuat', data: { booking } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat booking' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      order: [['scheduledAt', 'DESC']],
    });
    res.json({ success: true, data: { bookings } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil booking' });
  }
};

// ==================== NOTIFICATIONS ====================
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    const unreadCount = await Notification.count({ where: { userId: req.user.id, isRead: false } });
    res.json({ success: true, data: { notifications, unreadCount } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil notifikasi' });
  }
};

exports.markNotificationsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true, readAt: new Date() },
      { where: { userId: req.user.id, isRead: false } }
    );
    res.json({ success: true, message: 'Semua notifikasi ditandai sudah dibaca' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui notifikasi' });
  }
};
