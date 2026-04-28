const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const courseController = require('../controllers/courseController');
const mainController = require('../controllers/mainController');
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

// ==================== AUTH ====================
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/refresh', authController.refreshToken);
router.get('/auth/me', protect, authController.getMe);
router.put('/auth/profile', protect, authController.updateProfile);
router.put('/auth/change-password', protect, authController.changePassword);

// ==================== COURSES ====================
router.get('/courses', courseController.getCourses);
router.get('/courses/my-courses', protect, courseController.getMyCourses);
router.get('/courses/:slug', courseController.getCourse);
router.post('/courses/:id/enroll', protect, courseController.enrollCourse);
router.put('/courses/:id/progress', protect, courseController.updateProgress);
router.post('/courses', protect, restrictTo('admin', 'mentor'), courseController.createCourse);

// ==================== MARKETPLACE ====================
router.get('/products', mainController.getProducts);
router.get('/products/:slug', mainController.getProduct);

// ==================== COMMUNITY ====================
router.get('/community/posts', mainController.getPosts);
router.get('/community/posts/:id', mainController.getPost);
router.post('/community/posts', protect, mainController.createPost);
router.post('/community/posts/:id/comments', protect, mainController.addComment);

// ==================== MENTORING ====================
router.get('/mentors', mainController.getMentors);
router.post('/bookings', protect, mainController.createBooking);
router.get('/bookings/my', protect, mainController.getMyBookings);

// ==================== PAYMENT ====================
router.post('/payments/create', protect, mainController.createPayment);
router.post('/payments/confirm/:orderId', protect, mainController.confirmPayment);
router.get('/payments/transactions', protect, mainController.getTransactions);

// ==================== NOTIFICATIONS ====================
router.get('/notifications', protect, mainController.getNotifications);
router.put('/notifications/read-all', protect, mainController.markNotificationsRead);

// ==================== ADMIN ====================
router.get('/admin/stats', protect, restrictTo('admin'), adminController.getDashboardStats);
router.get('/admin/users', protect, restrictTo('admin'), adminController.getUsers);
router.put('/admin/users/:id', protect, restrictTo('admin'), adminController.updateUser);
router.post('/admin/courses', protect, restrictTo('admin'), adminController.createCourse);
router.put('/admin/courses/:id', protect, restrictTo('admin'), adminController.updateCourse);
router.post('/admin/products', protect, restrictTo('admin'), adminController.createProduct);
router.get('/admin/orders', protect, restrictTo('admin'), adminController.getOrders);
router.post('/admin/broadcast', protect, restrictTo('admin'), adminController.broadcastNotification);

module.exports = router;
