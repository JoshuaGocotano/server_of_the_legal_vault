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

// Fetching Payments of a specific Case by case_id
export const getPaymentsByCaseId = async (case_id) => {
  const { rows } = await query(
    `SELECT *
        FROM payment_tbl p
        LEFT JOIN case_tbl c ON p.case_id = c.case_id
        LEFT JOIN user_tbl u ON p.user_id = u.user_id
        LEFT JOIN client_tbl cl ON c.client_id = cl.client_id
        LEFT JOIN case_category_tbl cc ON c.cc_id = cc.cc_id
        LEFT JOIN cc_type_tbl ct ON c.ct_id = ct.ct_id
        WHERE p.case_id = $1
        ORDER BY p.payment_date DESC`,
    [case_id]
  );
  return rows;
};

// Fetching Payments of a specific Lawyer by lawyer_id
export const getPaymentsByLawyerId = async (lawyer_id) => {
  const { rows } = await query(
    `SELECT *
        FROM payment_tbl p
        LEFT JOIN case_tbl c ON p.case_id = c.case_id
        LEFT JOIN user_tbl u ON p.user_id = u.user_id
        LEFT JOIN client_tbl cl ON c.client_id = cl.client_id
        LEFT JOIN case_category_tbl cc ON c.cc_id = cc.cc_id
        LEFT JOIN cc_type_tbl ct ON c.ct_id = ct.ct_id
        WHERE c.user_id = $1
        ORDER BY p.payment_date DESC`,
    [lawyer_id]
  );
  return rows;
};

// Adding a New Payment
export const addPayment = async (paymentData) => {
  const {
    case_id,
    user_id,
    payment_amount,
    payment_type,
    cheque_name,
    cheque_number,
    cheque_branch,
    cheque_location,
  } = paymentData;

  // If payment type is Cheque, include cheque fields
  if (payment_type === "Cheque") {
    // Use cheque_name/cheque_number first, fallback to check_name/check_number for compatibility
    const chequeName = cheque_name;
    const chequeNumber = cheque_number;
    const chequeBranch = cheque_branch;
    const chequeLocation = cheque_location;

    const { rows } = await query(
      `INSERT INTO payment_tbl (case_id, user_id, payment_amount, payment_type, cheque_name, cheque_number, cheque_branch, cheque_location)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        case_id,
        user_id,
        payment_amount,
        payment_type,
        chequeName,
        chequeNumber,
        chequeBranch,
        chequeLocation,
      ]
    );
    return rows[0];
  } else {
    // For Cash payments, don't include cheque fields
    const { rows } = await query(
      `INSERT INTO payment_tbl (case_id, user_id, payment_amount, payment_type)
          VALUES ($1, $2, $3, $4) RETURNING *`,
      [case_id, user_id, payment_amount, payment_type]
    );
    return rows[0];
  }
};

// Deleting a Payment by payment_id
export const deletePayment = async (payment_id) => {
  const { rows } = await query(
    `DELETE FROM payment_tbl WHERE payment_id = $1 RETURNING *`,
    [payment_id]
  );
  return rows[0];
};
