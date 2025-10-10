import * as notificationService from "../services/notificationServices.js";

// Fetching All Notifications
export const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getNotifications();
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Error fetching notifications", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get Unread Notification Count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount();
    res.status(200).json({ count });
  } catch (err) {
    console.error("Error fetching unread notification count", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
