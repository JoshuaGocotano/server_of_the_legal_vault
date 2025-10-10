// ----------------  SERVICES or QUERIES for the Notification of the BOS Law Firm

import { query } from "../db.js";

// Fetching All Notifications from the notification_tbl that has is_cleared = false
export const getNotifications = async () => {
  const { rows } = await query(
    "SELECT * FROM notification_tbl WHERE is_cleared = false ORDER BY date_created DESC"
  );
  return rows;
};

// Get Unread Notification Count
export const getUnreadCount = async () => {
  const { rows } = await query(
    "SELECT COUNT(*) AS count FROM notification_tbl WHERE is_read = false"
  );
  return parseInt(rows[0].count, 10) || 0;
};
