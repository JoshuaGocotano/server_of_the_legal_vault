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
