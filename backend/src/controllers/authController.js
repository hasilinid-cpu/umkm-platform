const User = require('../models/User');
const { generateTokens } = require('../middleware/auth');
const { createNotification } = require('../utils/notifications');

// @POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, businessName, businessType, city } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar' });
    }

    const user = await User.create({ name, email, password, businessName, businessType, city });

    const { accessToken, refreshToken } = generateTokens(user.id);

    await createNotification(user.id, {
      type: 'system',
      title: 'Selamat Datang di UMKM Penggerak Indonesia! 🎉',
      message: `Halo ${user.name}, akun Anda berhasil dibuat. Mulai eksplorasi platform kami!`,
      link: '/dashboard',
    });

    res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

// @POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Akun Anda telah dinonaktifkan' });
    }

    await user.update({ lastLoginAt: new Date() });
    const { accessToken, refreshToken } = generateTokens(user.id);

    res.json({
      success: true,
      message: 'Login berhasil',
      data: { user, accessToken, refreshToken },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server' });
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};

// @PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'bio', 'phone', 'businessName', 'businessType', 'city', 'notificationPrefs'];
    const updates = {};
    allowed.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

    await req.user.update(updates);
    res.json({ success: true, message: 'Profil berhasil diperbarui', data: { user: req.user } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil' });
  }
};

// @PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Password lama tidak sesuai' });
    }
    await req.user.update({ password: newPassword });
    res.json({ success: true, message: 'Password berhasil diubah' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengubah password' });
  }
};

// @POST /api/auth/refresh
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token diperlukan' });

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) return res.status(401).json({ success: false, message: 'User tidak ditemukan' });

    const tokens = generateTokens(user.id);
    res.json({ success: true, data: tokens });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Refresh token tidak valid' });
  }
};
