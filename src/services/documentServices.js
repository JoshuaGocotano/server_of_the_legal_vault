// ------------------- SERVICES or QUERIES FOR DOCUMENTS

import { query } from "../db.js";

import bcrypt from "bcrypt";
const saltRounds = 10;

// Get all documents
export const getDocuments = async () => {
  const { rows } = await query(
    "SELECT * FROM document_tbl ORDER BY doc_id DESC"
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

// Get all task documents assigned to a specific user
export const getTaskDocumentsByUser = async (userId) => {
  const { rows } = await query(
    "SELECT * FROM document_tbl WHERE doc_type = 'Task' AND (doc_tasked_to = $1 OR doc_tasked_by = $1) ORDER BY doc_id DESC",
    [userId]
  );
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
    doc_status,
    doc_tag,
    doc_password,
    doc_tasked_to,
    doc_tasked_by,
    doc_submitted_by,
    doc_reference,
    doc_last_updated_by,
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
      doc_status = COALESCE($8, doc_status),
      doc_tag = COALESCE($9, doc_tag),
      doc_password = COALESCE($10, doc_password),
      doc_tasked_to = COALESCE($11, doc_tasked_to),
      doc_tasked_by = COALESCE($12, doc_tasked_by),
      doc_submitted_by = COALESCE($13, doc_submitted_by),
      doc_reference = COALESCE($14, doc_reference),
      doc_last_updated_by = COALESCE($15, doc_last_updated_by),
      case_id = COALESCE($16, case_id)
    WHERE doc_id = $17
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
    doc_status,
    doc_tag,
    hashedPassword,
    doc_tasked_to,
    doc_tasked_by,
    doc_submitted_by,
    doc_reference,
    doc_last_updated_by,
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

// count of pending task documents where the doc_status is "todo"
export const countPendingTaskDocuments = async () => {
  const { rows } = await query(
    `SELECT COUNT(*) FROM document_tbl WHERE doc_type = 'Task' AND doc_status = 'todo'`
  );
  return rows[0].count;
};
