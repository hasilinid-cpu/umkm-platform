const { Course, Lesson, Enrollment } = require('../models/Course');
const { Order } = require('../models/index');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

// @GET /api/courses
exports.getCourses = async (req, res) => {
  try {
    const { category, level, search, page = 1, limit = 12, sort = 'createdAt' } = req.query;
    const where = { isPublished: true };
    if (category) where.category = category;
    if (level) where.level = level;
    if (search) where.title = { [Op.iLike]: `%${search}%` };

    const offset = (page - 1) * limit;
    const order = sort === 'popular' ? [['enrollmentCount', 'DESC']] :
                  sort === 'rating' ? [['rating', 'DESC']] :
                  [['createdAt', 'DESC']];

    const { count, rows } = await Course.findAndCountAll({
      where, order, limit: parseInt(limit), offset: parseInt(offset),
    });

    res.json({
      success: true,
      data: {
        courses: rows,
        pagination: { total: count, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(count / limit) },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil data kursus' });
  }
};

// @GET /api/courses/:slug
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({
      where: { slug: req.params.slug, isPublished: true },
      include: [{ model: Lesson, as: 'lessons', where: { isPublished: true }, required: false, order: [['order', 'ASC']] }],
    });
    if (!course) return res.status(404).json({ success: false, message: 'Kursus tidak ditemukan' });

    // Check enrollment if authenticated
    let isEnrolled = false;
    let enrollment = null;
    if (req.user) {
      enrollment = await Enrollment.findOne({ where: { userId: req.user.id, courseId: course.id } });
      isEnrolled = !!enrollment;
    }

    // Hide video URLs for non-enrolled users (except free previews)
    const lessonsData = course.lessons?.map(l => ({
      ...l.toJSON(),
      videoUrl: isEnrolled || l.isFreePreview ? l.videoUrl : null,
    }));

    res.json({ success: true, data: { course: { ...course.toJSON(), lessons: lessonsData }, isEnrolled, enrollment } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil detail kursus' });
  }
};

// @POST /api/courses/:id/enroll
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Kursus tidak ditemukan' });

    const existing = await Enrollment.findOne({ where: { userId: req.user.id, courseId: course.id } });
    if (existing) return res.status(409).json({ success: false, message: 'Sudah terdaftar di kursus ini' });

    // Premium check
    if (course.isPremiumOnly && req.user.membership !== 'premium') {
      return res.status(403).json({ success: false, message: 'Kursus ini hanya untuk member Premium', requiresPremium: true });
    }

    // Paid course check
    if (!course.isFree && course.price > 0) {
      return res.status(402).json({ success: false, message: 'Silakan selesaikan pembayaran terlebih dahulu', requiresPayment: true, price: course.price });
    }

    const enrollment = await Enrollment.create({ userId: req.user.id, courseId: course.id });
    await course.increment('enrollmentCount');

    res.status(201).json({ success: true, message: 'Berhasil mendaftar kursus', data: { enrollment } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mendaftar kursus' });
  }
};

// @PUT /api/courses/:id/progress
exports.updateProgress = async (req, res) => {
  try {
    const { lessonId, completed } = req.body;
    const enrollment = await Enrollment.findOne({ where: { userId: req.user.id, courseId: req.params.id } });
    if (!enrollment) return res.status(404).json({ success: false, message: 'Tidak terdaftar di kursus ini' });

    let completedLessons = enrollment.completedLessons || [];
    if (completed && !completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    } else if (!completed) {
      completedLessons = completedLessons.filter(id => id !== lessonId);
    }

    const course = await Course.findByPk(req.params.id);
    const progress = Math.round((completedLessons.length / (course.totalLessons || 1)) * 100);
    const isCompleted = progress === 100;

    await enrollment.update({
      completedLessons,
      progress,
      lastAccessedAt: new Date(),
      status: isCompleted ? 'completed' : 'active',
      completedAt: isCompleted && !enrollment.completedAt ? new Date() : enrollment.completedAt,
    });

    res.json({ success: true, data: { enrollment, progress } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal memperbarui progress' });
  }
};

// @GET /api/courses/my-courses
exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { userId: req.user.id },
      order: [['updatedAt', 'DESC']],
    });

    const courseIds = enrollments.map(e => e.courseId);
    const courses = await Course.findAll({ where: { id: courseIds } });

    const data = enrollments.map(enrollment => ({
      ...enrollment.toJSON(),
      course: courses.find(c => c.id === enrollment.courseId),
    }));

    res.json({ success: true, data: { enrollments: data } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal mengambil kursus saya' });
  }
};

// @POST /api/courses (admin)
exports.createCourse = async (req, res) => {
  try {
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
    const course = await Course.create({ ...req.body, slug, mentorId: req.user.id, mentorName: req.user.name });
    res.status(201).json({ success: true, data: { course } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Gagal membuat kursus' });
  }
};
