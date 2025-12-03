import * as notificationService from "../services/notificationServices.js";

// Fetching All Notifications
export const getNotificationsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const notifications = await notificationService.getNotificationsByUserId(
      user_id
    );
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Unread Notification Count of a user
export const getUnreadCountByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const count = await notificationService.getUnreadCountByUserId(user_id);
    res.status(200).json({ count });
  } catch (err) {
    console.error("Error fetching unread notification count", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Mark a Notification as Read
export const markNotificationAsReadOrUnread = async (req, res) => {
  try {
    const { notification_id } = req.params;
    await notificationService.markNotificationAsReadOrUnread(notification_id);
    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Error marking notification as read", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Clear Notifications
export const clearNotificationsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    await notificationService.clearNotificationsByUserId(user_id);
    res.status(200).json({ message: "Notifications cleared" });
  } catch (err) {
    console.error("Error clearing notifications", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
