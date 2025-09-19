// ----------------  SERVICES or QUERIES for the Notification of the BOS Law Firm

import { query } from "../db.js";

// Fetching All Notifications from the notification_tbl
export const getNotifications = async () => {
  const { rows } = await query(
    "SELECT * FROM notification_tbl ORDER BY date_created DESC"
  );
  return rows;
};
