import express from "express";

import * as notificationController from "../controllers/notificationController.js";
import verifyUser from "../middleware/verifyUser.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.get(
  "/notifications/:user_id",
  verifyUser,
  notificationController.getNotificationsByUserId
);

// Fetch unread count
router.get(
  "/notifications/unread-count/:user_id",
  verifyUser,
  notificationController.getUnreadCountByUserId
);

// Mark notification as read or unread depending on the request body
router.put(
  "/notifications/mark-read-or-unread/:notification_id",
  verifyUser,
  notificationController.markNotificationAsReadOrUnread
);

// Clear notifications
router.put(
  "/notifications/clear/:user_id",
  verifyUser,
  notificationController.clearNotificationsByUserId
);

export default router;
