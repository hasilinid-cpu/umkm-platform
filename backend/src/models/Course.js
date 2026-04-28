const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  slug: { type: DataTypes.STRING(250), unique: true, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  shortDescription: { type: DataTypes.STRING(500) },
  thumbnail: { type: DataTypes.STRING, allowNull: true },
  category: {
    type: DataTypes.ENUM('marketing', 'keuangan', 'operasional', 'digital', 'legal', 'leadership', 'produksi', 'ekspor'),
    allowNull: false,
  },
  level: { type: DataTypes.ENUM('pemula', 'menengah', 'mahir'), defaultValue: 'pemula' },
  language: { type: DataTypes.STRING(10), defaultValue: 'id' },
  price: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  originalPrice: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
  isFree: { type: DataTypes.BOOLEAN, defaultValue: false },
  isPremiumOnly: { type: DataTypes.BOOLEAN, defaultValue: false },
  mentorId: { type: DataTypes.UUID, allowNull: false },
  mentorName: { type: DataTypes.STRING(100) },
  mentorAvatar: { type: DataTypes.STRING },
  totalDuration: { type: DataTypes.INTEGER, defaultValue: 0 }, // in minutes
  totalLessons: { type: DataTypes.INTEGER, defaultValue: 0 },
  enrollmentCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  rating: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  reviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  syllabus: { type: DataTypes.JSONB, defaultValue: [] },
  requirements: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
  objectives: { type: DataTypes.ARRAY(DataTypes.TEXT), defaultValue: [] },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: false },
  publishedAt: { type: DataTypes.DATE, allowNull: true },
  featuredOrder: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { timestamps: true });

const Lesson = sequelize.define('Lesson', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  courseId: { type: DataTypes.UUID, allowNull: false },
  title: { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT },
  videoUrl: { type: DataTypes.STRING },
  videoProvider: { type: DataTypes.ENUM('youtube', 'vimeo', 'local'), defaultValue: 'youtube' },
  duration: { type: DataTypes.INTEGER, defaultValue: 0 }, // minutes
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  sectionTitle: { type: DataTypes.STRING(200) },
  isFreePreview: { type: DataTypes.BOOLEAN, defaultValue: false },
  resources: { type: DataTypes.JSONB, defaultValue: [] },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { timestamps: true });

const Enrollment = sequelize.define('Enrollment', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  courseId: { type: DataTypes.UUID, allowNull: false },
  status: { type: DataTypes.ENUM('active', 'completed', 'refunded'), defaultValue: 'active' },
  progress: { type: DataTypes.INTEGER, defaultValue: 0 }, // percentage
  completedLessons: { type: DataTypes.ARRAY(DataTypes.UUID), defaultValue: [] },
  lastAccessedAt: { type: DataTypes.DATE },
  completedAt: { type: DataTypes.DATE, allowNull: true },
  certificateUrl: { type: DataTypes.STRING, allowNull: true },
  paymentAmount: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
}, { timestamps: true });

Course.hasMany(Lesson, { foreignKey: 'courseId', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = { Course, Lesson, Enrollment };
