// ----------------  SERVICES or QUERIES for Payments  ----------------

import { query } from "../db.js";

// Fetching All Payments
export const getPayments = async () => {
  const { rows } = await query(
    `SELECT *
        FROM payment_tbl p
        LEFT JOIN case_tbl c ON p.case_id = c.case_id
        LEFT JOIN user_tbl u ON p.user_id = u.user_id
        LEFT JOIN client_tbl cl ON c.client_id = cl.client_id
        LEFT JOIN case_category_tbl cc ON c.cc_id = cc.cc_id
        LEFT JOIN cc_type_tbl ct ON c.ct_id = ct.ct_id
        ORDER BY p.payment_date DESC`
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
