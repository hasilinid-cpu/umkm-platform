const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// ==================== MARKETPLACE ====================
const Product = sequelize.define('Product', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(250), unique: true },
  description: { type: DataTypes.TEXT },
  shortDescription: { type: DataTypes.STRING(500) },
  thumbnail: { type: DataTypes.STRING },
  category: {
    type: DataTypes.ENUM('template', 'sop', 'excel', 'ebook', 'presentasi', 'lainnya'),
    allowNull: false,
  },
  price: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  originalPrice: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  isFree: { type: DataTypes.BOOLEAN, defaultValue: false },
  isPremiumOnly: { type: DataTypes.BOOLEAN, defaultValue: false },
  fileUrl: { type: DataTypes.STRING },
  fileSize: { type: DataTypes.STRING },
  fileType: { type: DataTypes.STRING },
  sellerId: { type: DataTypes.UUID },
  sellerName: { type: DataTypes.STRING(100) },
  downloadCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
  features: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
}, { timestamps: true });

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderNumber: { type: DataTypes.STRING(50), unique: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  items: { type: DataTypes.JSONB, defaultValue: [] },
  subtotal: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  discount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  total: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
  },
  paymentMethod: { type: DataTypes.STRING(50) },
  paymentData: { type: DataTypes.JSONB, defaultValue: {} },
  paidAt: { type: DataTypes.DATE, allowNull: true },
  type: { type: DataTypes.ENUM('course', 'product', 'membership'), defaultValue: 'product' },
  referenceId: { type: DataTypes.UUID, allowNull: true },
}, { timestamps: true });

// ==================== COMMUNITY ====================
const Post = sequelize.define('Post', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  authorId: { type: DataTypes.UUID, allowNull: false },
  authorName: { type: DataTypes.STRING(100) },
  authorAvatar: { type: DataTypes.STRING },
  title: { type: DataTypes.STRING(300), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  category: {
    type: DataTypes.ENUM('kuliner', 'fashion', 'teknologi', 'pertanian', 'kerajinan', 'jasa', 'retail', 'umum'),
    defaultValue: 'umum',
  },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  likeCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  commentCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  viewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  isPinned: { type: DataTypes.BOOLEAN, defaultValue: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  images: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
}, { timestamps: true });

const Comment = sequelize.define('Comment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  postId: { type: DataTypes.UUID, allowNull: false },
  authorId: { type: DataTypes.UUID, allowNull: false },
  authorName: { type: DataTypes.STRING(100) },
  authorAvatar: { type: DataTypes.STRING },
  content: { type: DataTypes.TEXT, allowNull: false },
  parentId: { type: DataTypes.UUID, allowNull: true },
  likeCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { timestamps: true });

// ==================== MENTORING ====================
const Mentor = sequelize.define('Mentor', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
  title: { type: DataTypes.STRING(200) },
  bio: { type: DataTypes.TEXT },
  avatar: { type: DataTypes.STRING },
  specializations: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  experience: { type: DataTypes.INTEGER, defaultValue: 0 }, // years
  sessionPrice: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  totalSessions: { type: DataTypes.INTEGER, defaultValue: 0 },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
  availability: { type: DataTypes.JSONB, defaultValue: {} }, // schedule slots
  linkedIn: { type: DataTypes.STRING },
  instagram: { type: DataTypes.STRING },
}, { timestamps: true });

const Booking = sequelize.define('Booking', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  mentorId: { type: DataTypes.UUID, allowNull: false },
  mentorName: { type: DataTypes.STRING(100) },
  scheduledAt: { type: DataTypes.DATE, allowNull: false },
  duration: { type: DataTypes.INTEGER, defaultValue: 60 }, // minutes
  topic: { type: DataTypes.STRING(300) },
  description: { type: DataTypes.TEXT },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending',
  },
  meetingUrl: { type: DataTypes.STRING },
  notes: { type: DataTypes.TEXT },
  amount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  paymentStatus: { type: DataTypes.ENUM('pending', 'paid', 'refunded'), defaultValue: 'pending' },
}, { timestamps: true });

// ==================== NOTIFICATION ====================
const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  type: {
    type: DataTypes.ENUM('course', 'community', 'booking', 'payment', 'system', 'achievement'),
    defaultValue: 'system',
  },
  title: { type: DataTypes.STRING(200), allowNull: false },
  message: { type: DataTypes.TEXT },
  data: { type: DataTypes.JSONB, defaultValue: {} },
  isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
  readAt: { type: DataTypes.DATE, allowNull: true },
  link: { type: DataTypes.STRING, allowNull: true },
}, { timestamps: true });

Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

module.exports = { Product, Order, Post, Comment, Mentor, Booking, Notification };
