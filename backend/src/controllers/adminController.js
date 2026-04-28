const User = require('../models/User');
const { Course, Enrollment } = require('../models/Course');
const { Product, Order, Post, Mentor, Booking, Notification } = require('../models/index');
const { Op, fn, col, literal } = require('sequelize');

// @GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [users, courses, products, orders, pendingBookings] = await Promise.all([
      User.count({ where: { role: 'user' } }),
      Course.count({ where: { isPublished: true } }),
      Product.count({ where: { isPublished: true } }),
      Order.count({ where: { status: 'paid' } }),
      Booking.count({ where: { status: 'pending' } }),
    ]);

    const revenue = await Order.sum('total', { where: { status: 'paid' } });
    const premiumUsers = await User.count({ where: { membership: 'premium' } });
    const newUsersThisMonth = await User.count({
      where: { createdAt: { [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
    });

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers: users,
          premiumUsers,
          newUsersThisMonth,
          totalCourses: courses,
          totalProducts: products,
          totalOrders: orders,
          totalRevenue: revenue || 0,
          pendingBookings,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil statistik' });
  }
};

// @GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const { search, role, membership, page = 1, limit = 20 } = req.query;
    const where = {};
    if (search) where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
    if (role) where.role = role;
    if (membership) where.membership = membership;

    const { count, rows } = await User.findAndCountAll({
      where, order: [['createdAt', 'DESC']],
      limit: parseInt(limit), offset: (page - 1) * limit,
    });

    res.json({ success: true, data: { users: rows, total: count } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna' });
  }
};

// @PUT /api/admin/users/:id
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
    const { role, membership, isActive } = req.body;
    await user.update({ role, membership, isActive });
    res.json({ success: true, message: 'User berhasil diperbarui', data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui user' });
  }
};

// @POST /api/admin/courses
exports.createCourse = async (req, res) => {
  try {
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const course = await Course.create({ ...req.body, slug });
    res.status(201).json({ success: true, data: { course } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat kursus' });
  }
};

// @PUT /api/admin/courses/:id
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Kursus tidak ditemukan' });
    await course.update(req.body);
    res.json({ success: true, data: { course } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui kursus' });
  }
};

// @POST /api/admin/products
exports.createProduct = async (req, res) => {
  try {
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const product = await Product.create({ ...req.body, slug, sellerId: req.user.id, sellerName: req.user.name });
    res.status(201).json({ success: true, data: { product } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat produk' });
  }
};

// @GET /api/admin/orders
exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const { count, rows } = await Order.findAndCountAll({
      where, order: [['createdAt', 'DESC']],
      limit: parseInt(limit), offset: (page - 1) * limit,
    });
    res.json({ success: true, data: { orders: rows, total: count } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil orders' });
  }
};

// @POST /api/admin/broadcast
exports.broadcastNotification = async (req, res) => {
  try {
    const { title, message, type = 'system', userIds } = req.body;
    let targetUsers;

    if (userIds && userIds.length > 0) {
      targetUsers = userIds;
    } else {
      const users = await User.findAll({ attributes: ['id'] });
      targetUsers = users.map(u => u.id);
    }

    const notifications = targetUsers.map(userId => ({ userId, type, title, message }));
    await Notification.bulkCreate(notifications);

    res.json({ success: true, message: `Notifikasi berhasil dikirim ke ${targetUsers.length} pengguna` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengirim notifikasi' });
  }
};
