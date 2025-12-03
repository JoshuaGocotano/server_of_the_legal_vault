// ----------------  SERVICES or QUERIES for the Notification of the BOS Law Firm

import { query } from "../db.js";

// Fetching notifications for users involved that has is_cleared = false
export const getNotificationsByUserId = async (user_id) => {
  const { rows } = await query(
    `
    SELECT *
    FROM notification_tbl
    WHERE user_id = $1
      AND is_cleared = false
    ORDER BY date_created DESC
    `,
    [user_id]
  );
  return rows;
};

// Get unread notification count of a user
export const getUnreadCountByUserId = async (user_id) => {
  const { rows } = await query(
    `SELECT COUNT(*) 
     FROM notification_tbl 
     WHERE user_id = $1
       AND is_read = false AND is_cleared = false`,
    [user_id]
  );
  return rows[0].count;
};

// Mark a notification as read or unread depending on the request body
export const markNotificationAsReadOrUnread = async (notification_id) => {
  // check first if the notification is read or unread
  const { rows } = await query(
    `SELECT is_read 
     FROM notification_tbl 
     WHERE notification_id = $1`,
    [notification_id]
  );
  const isRead = rows[0]?.is_read;
  const newIsRead = !isRead;

  await query(
    `UPDATE notification_tbl 
     SET is_read = $1
     WHERE notification_id = $2`,
    [newIsRead, notification_id]
  );
};

// clearing notifications => setting is_cleared to true
export const clearNotificationsByUserId = async (user_id) => {
  await query(
    `UPDATE notification_tbl 
     SET is_cleared = true
     WHERE user_id = $1`,
    [user_id]
  );
};
