// ------------------- SERVICES or QUERIES FOR DOCUMENTS

import { query } from "../db.js";

import bcrypt from "bcrypt";
const saltRounds = 10;

// Get all documents
export const getDocuments = async () => {
  const { rows } = await query(
    `SELECT d.* FROM document_tbl d 
     JOIN case_tbl c ON d.case_id = c.case_id
     WHERE c.case_status != 'Archived (Completed)' AND c.case_status != 'Archived (Dismissed)' 
     AND c.case_status != 'Dismissed' AND c.case_status != 'Completed'
     ORDER BY doc_id DESC`
  );
  return rows;
};

// Get all documents of lawyer's cases
export const getDocumentsByLawyer = async (lawyerId) => {
  const { rows } = await query(
    `SELECT d.* FROM document_tbl d
     JOIN case_tbl c ON d.case_id = c.case_id
      WHERE c.user_id = $1
      ORDER BY d.doc_id DESC`,
    [lawyerId]
  );
  return rows;
};

// Get a single document by ID
export const getDocumentById = async (docId) => {
  const { rows } = await query("SELECT * FROM document_tbl WHERE doc_id = $1", [
    docId,
  ]);
  return rows[0];
};

// Get documents by Case ID
export const getDocumentsByCaseId = async (caseId) => {
  const { rows } = await query(
    "SELECT * FROM document_tbl WHERE case_id = $1 ORDER BY doc_id ASC",
    [caseId]
  );
  return rows;
};

// Get documents submitted by a specific user
export const getDocumentsBySubmitter = async (userId) => {
  const { rows } = await query(
    "SELECT * FROM document_tbl WHERE doc_submitted_by = $1 ORDER BY doc_id DESC",
    [userId]
  );
  return rows;
};

// Get all task documents assigned to (staff/paralegal) or tasked by (admin/lawyer) a specific user
export const getTaskDocumentsByUser = async (userId) => {
  const sql = `
    SELECT DISTINCT d.*, c.case_id, c.case_status, c.user_id AS case_user_id
    FROM document_tbl d
    LEFT JOIN case_tbl c ON d.case_id = c.case_id
    WHERE d.doc_type = 'Task'
      AND (
        d.doc_tasked_to = $1
        OR d.doc_tasked_by = $1
        OR c.user_id = $1
      )
      AND (c.case_status NOT IN ('Archived (Completed)', 'Archived (Dismissed)', 'Completed', 'Dismissed') OR c.case_status IS NULL)
    ORDER BY d.doc_id DESC;
  `;

  const { rows } = await query(sql, [userId]);
  return rows;
};

// Create a new document
export const createDocument = async (docData) => {
  const {
    doc_name,
    doc_type, // "Support Document" | "Task Document"
    doc_description = null,
    doc_task = null,
    doc_file = null,
    doc_prio_level = null,
    doc_due_date = null,
    doc_status = null,
    doc_tag = null,
    doc_password = null,
    doc_tasked_to = null,
    doc_tasked_by = null,
    doc_submitted_by = null,
    doc_reference = null,
    case_id = null,
  } = docData;

  if (!doc_name || !doc_type) {
    throw new Error("doc_name and doc_type are required");
  }

  const hashedPassword = doc_password
    ? await bcrypt.hash(doc_password.toString(), saltRounds)
    : null;

  const queryStr = `
    INSERT INTO document_tbl (
      doc_name, doc_type, doc_description, doc_task, doc_file,
      doc_prio_level, doc_due_date, doc_status, doc_tag, doc_password,
      doc_tasked_to, doc_tasked_by, doc_submitted_by, doc_reference, case_id
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15
    ) RETURNING *;
  `;

  const params = [
    doc_name,
    doc_type,
    doc_description,
    doc_task,
    doc_file,
    doc_prio_level,
    doc_due_date,
    doc_status,
    doc_tag,
    hashedPassword,
    doc_tasked_to,
    doc_tasked_by,
    doc_submitted_by,
    doc_reference,
    case_id,
  ];

  const { rows } = await query(queryStr, params);
  return rows[0];
};

// Update a document
export const updateDocument = async (docId, docData) => {
  const {
    doc_name,
    doc_type,
    doc_description,
    doc_task,
    doc_file,
    doc_prio_level,
    doc_due_date,
    doc_date_submitted,
    doc_status,
    doc_tag,
    doc_password,
    doc_tasked_to,
    doc_tasked_by,
    doc_submitted_by,
    doc_reference,
    doc_last_updated_by,
    is_trashed,
    doc_trashed_by,
    doc_trashed_date,
    case_id,
  } = docData;

  const hashedPassword = doc_password
    ? await bcrypt.hash(doc_password.toString(), saltRounds)
    : null;
  const queryStr = `
    UPDATE document_tbl SET
      doc_name = COALESCE($1, doc_name),
      doc_type = COALESCE($2, doc_type),
      doc_description = COALESCE($3, doc_description),
      doc_task = COALESCE($4, doc_task),
      doc_file = COALESCE($5, doc_file),
      doc_prio_level = COALESCE($6, doc_prio_level),
      doc_due_date = COALESCE($7, doc_due_date),
      doc_date_submitted = COALESCE($8, doc_date_submitted),
      doc_status = COALESCE($9, doc_status),
      doc_tag = COALESCE($10, doc_tag),
      doc_password = COALESCE($11, doc_password),
      doc_tasked_to = COALESCE($12, doc_tasked_to),
      doc_tasked_by = COALESCE($13, doc_tasked_by),
      doc_submitted_by = COALESCE($14, doc_submitted_by),
      doc_reference = COALESCE($15::jsonb, doc_reference),
      doc_last_updated_by = COALESCE($16, doc_last_updated_by),
      doc_trashed_by = COALESCE($17, doc_trashed_by),
      doc_trashed_date = COALESCE($18, doc_trashed_date),
      is_trashed = COALESCE($19, is_trashed),
      case_id = COALESCE($20, case_id)
    WHERE doc_id = $21
    RETURNING *;
  `;

  const params = [
    doc_name,
    doc_type,
    doc_description,
    doc_task,
    doc_file,
    doc_prio_level,
    doc_due_date,
    doc_date_submitted,
    doc_status,
    doc_tag,
    hashedPassword,
    doc_tasked_to,
    doc_tasked_by,
    doc_submitted_by,
    doc_reference,
    doc_last_updated_by,
    doc_trashed_by,
    doc_trashed_date,
    is_trashed,
    case_id,
    docId,
  ];

  const { rows } = await query(queryStr, params);
  return rows[0];
};

// Delete a document
export const deleteDocument = async (docId) => {
  const { rows } = await query(
    "DELETE FROM document_tbl WHERE doc_id = $1 RETURNING *",
    [docId]
  );
  return rows[0];
};

// Simple search by name / tag / status
export const searchDocuments = async (term) => {
  const like = `%${term}%`;
  const { rows } = await query(
    `SELECT * FROM document_tbl
     WHERE doc_name ILIKE $1 OR COALESCE(doc_tag,'') ILIKE $1 OR COALESCE(doc_status,'') ILIKE $1
     ORDER BY doc_id DESC`,
    [like]
  );
  return rows;
};

// count for approval documents with status "done" for dashboard
export const countForApprovalDocuments = async () => {
  const { rows } = await query(
    `SELECT COUNT(*) FROM document_tbl WHERE doc_status = 'done'`
  );
  return rows[0].count;
};

// count of the processing documents where the status of its case_id is "processing"
export const countProcessingDocuments = async () => {
  const { rows } = await query(
    `SELECT COUNT(*) FROM document_tbl d
      JOIN case_tbl c ON d.case_id = c.case_id
      WHERE c.case_status = 'Processing'`
  );
  return rows[0].count;
};

// count processing documents of a lawyer's cases
export const countProcessingDocumentsByLawyer = async (lawyerId) => {
  const { rows } = await query(
    `SELECT COUNT(*) FROM document_tbl d
      JOIN case_tbl c ON d.case_id = c.case_id
      WHERE c.case_status = 'Processing' AND c.user_id = $1`,
    [lawyerId]
  );
  return rows[0].count;
};

// count of pending task documents where the doc_status is not "approved"
export const countPendingTaskDocuments = async () => {
  const { rows } = await query(
    `SELECT COUNT(*) FROM document_tbl d 
     JOIN case_tbl c ON d.case_id = c.case_id
     WHERE doc_type = 'Task' AND doc_status != 'approved'
     AND (c.case_status NOT IN ('Archived (Completed)', 'Archived (Dismissed)', 'Completed', 'Dismissed') OR c.case_status IS NULL)`
  );
  return rows[0].count;
};

// count pending task documents assigned to a paralegal or staff (for staff/paralegal/lawyer dashboard)
export const countUserPendingTaskDocuments = async (userId) => {
  const sql = `
    SELECT COUNT(DISTINCT d.doc_id) AS count
    FROM document_tbl d
    LEFT JOIN case_tbl c ON d.case_id = c.case_id
    WHERE 
      d.doc_type = 'Task'
      AND (
        d.doc_tasked_to = $1         -- tasks assigned to the user
        OR d.doc_tasked_by = $1      -- tasks created by the user
        OR c.user_id = $1            -- tasks belonging to lawyer's cases
      )
      AND (d.doc_status IS NULL OR LOWER(d.doc_status) NOT IN ('approved', 'completed'))
      AND (c.case_status NOT IN ('Archived (Completed)', 'Archived (Dismissed)', 'Completed', 'Dismissed') OR c.case_status IS NULL)
  `;

  const { rows } = await query(sql, [userId]);
  return Number(rows[0].count) || 0;
};

// Remove a specific reference path from doc_reference JSONB array
export const removeReferenceFromDocument = async (docId, referencePath) => {
  const sql = `
    UPDATE document_tbl
    SET doc_reference = COALESCE((
      SELECT jsonb_agg(value)
      FROM jsonb_array_elements(doc_reference)
      WHERE value::text <> to_jsonb($1::text)::text
    ), '[]'::jsonb)
    WHERE doc_id = $2
    RETURNING *;
  `;
  const { rows } = await query(sql, [referencePath, docId]);
  return rows[0];
};
