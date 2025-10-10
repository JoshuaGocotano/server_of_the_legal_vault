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

export default router;
