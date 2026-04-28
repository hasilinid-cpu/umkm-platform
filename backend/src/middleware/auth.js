const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  });
  return { accessToken, refreshToken };
};

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token akses tidak ditemukan' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User tidak ditemukan atau tidak aktif' });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token sudah kadaluarsa', expired: true });
    }
    return res.status(401).json({ success: false, message: 'Token tidak valid' });
  }
};

const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Anda tidak memiliki izin untuk aksi ini' });
  }
  next();
};

const requirePremium = (req, res, next) => {
  const now = new Date();
  const isPremium = req.user.membership === 'premium' &&
    (!req.user.membershipExpiresAt || new Date(req.user.membershipExpiresAt) > now);
  if (!isPremium) {
    return res.status(403).json({
      success: false,
      message: 'Fitur ini memerlukan membership Premium',
      requiresPremium: true,
    });
  }
  next();
};

module.exports = { generateTokens, protect, restrictTo, requirePremium };
