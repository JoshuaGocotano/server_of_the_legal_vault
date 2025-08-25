// ----------------  SERVICES or QUERIES for Payments  ----------------

import { query } from "../db.js";

// Fetching All Payments
export const getPayments = async () => {
  const { rows } = await query(
    "SELECT * FROM payment_tbl ORDER BY payment_date DESC"
  );
  return rows;
};

// Fetching Payments of a specific Lawyer by lawyer_id
export const getPaymentsByLawyerId = async (lawyer_id) => {
  const { rows } = await query(
    `SELECT *
        FROM payment_tbl p
        JOIN case_tbl c ON p.case_id = c.case_id
        JOIN user_tbl u ON p.user_id = u.user_id
        WHERE c.user_id = $1
        ORDER BY p.payment_date DESC`,
    [lawyer_id]
  );
  return rows;
};
