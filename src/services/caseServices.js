// ----------------  SERVICES or QUERIES for the Cases of the BOS Law Firm ... ---------------- //

import { query } from "../db.js";

// Fetching All Cases from the case_tbl
export const getCases = async () => {
  const queryStr = `
    SELECT *
    FROM case_tbl c
    JOIN user_tbl u ON c.user_id = u.user_id
    JOIN client_tbl cl ON c.client_id = cl.client_id
    JOIN case_category_tbl cc ON c.cc_id = cc.cc_id
    JOIN cc_type_tbl ct ON c.ct_id = ct.ct_id
    ORDER BY c.case_id;
  `;
  const { rows } = await query(queryStr);
  return rows;
};

// Fetching a Single Case by ID
export const getCaseById = async (caseId) => {
  const queryStr = `
    SELECT *
    FROM case_tbl c
    JOIN user_tbl u ON c.user_id = u.user_id
    JOIN client_tbl cl ON c.client_id = cl.client_id
    JOIN case_category_tbl cc ON c.cc_id = cc.cc_id
    JOIN cc_type_tbl ct ON c.ct_id = ct.ct_id
    WHERE c.case_id = $1
    ORDER BY c.case_id;
  `;
  const { rows } = await query(queryStr, [caseId]);
  return rows[0];
};

// Creating a New Case
export const createCase = async (caseData) => {
  const {
    case_status,
    case_fee,
    case_remarks,
    case_cabinet,
    case_drawer,
    user_id,
    client_id,
    cc_id,
    ct_id,
  } = caseData;

  const queryStr = `
    INSERT INTO case_tbl (case_status, case_fee, case_balance, case_remarks, case_cabinet, case_drawer, user_id, client_id, cc_id, ct_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  const { rows } = await query(queryStr, [
    case_status,
    case_fee,
    case_fee, // case_balance is the same as case_fee initially
    case_remarks,
    case_cabinet,
    case_drawer,
    user_id,
    client_id,
    cc_id,
    ct_id,
  ]);

  return rows[0];
};
