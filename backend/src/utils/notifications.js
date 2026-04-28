const { Notification } = require('../models/index');

const createNotification = async (userId, { type, title, message, data = {}, link }) => {
  try {
    return await Notification.create({ userId, type, title, message, data, link });
  } catch (error) {
    console.error('Failed to create notification:', error.message);
  }
};

module.exports = { createNotification };
