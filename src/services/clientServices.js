// ----------------  SERVICES or QUERIES

import { query } from "../db.js";

import bcrypt from "bcrypt";
const saltRounds = 10;

// Fetching clients (The only ones that are not Removed)
export const getClients = async () => {
  const { rows } = await query(
    "SELECT * FROM client_tbl WHERE client_status = 'Active' or client_status = 'Inactive' ORDER BY client_id ASC"
  );
  return rows;
};

// Fetching ALL Clients (with those Removed)
export const getAllClients = async () => {
  const { rows } = await query(
    "SELECT * FROM client_tbl ORDER BY client_id ASC"
  );
  return rows;
};

// Fetching all clients of a certain lawyer
export const getClientsByLawyerId = async (userId) => {
  const { rows } = await query(
    `SELECT * FROM client_tbl WHERE created_by = $1 AND client_status != 'Removed'`,
    [userId]
  );
  return rows;
};

// Adding a new client
export const createClient = async (clientData) => {
  const {
    client_fullname,
    client_email,
    client_phonenum,
    created_by,
    client_password,
    client_status = "Active",
  } = clientData;

  // Hashing here
  const hashedPassword = await bcrypt.hash(
    client_password.toString(),
    saltRounds
  );

  const { rows } = await query(
    "INSERT INTO client_tbl (client_fullname, client_email, client_phonenum, created_by, client_password, client_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      client_fullname,
      client_email,
      client_phonenum,
      created_by,
      hashedPassword,
      client_status,
    ]
  );
  return rows[0];
};

// Updating an existing client
export const updateClient = async (clientId, clientData) => {
  const {
    client_fullname,
    client_email,
    client_phonenum,
    client_password,
    client_status,
    client_last_updated_by,
  } = clientData;

  let hashedPassword = null;
  if (client_password) {
    hashedPassword = await bcrypt.hash(client_password.toString(), saltRounds);
  } else {
    const { rows } = await query(
      "SELECT client_password FROM client_tbl WHERE client_id = $1",
      [clientId]
    );
    hashedPassword = rows[0]?.client_password;
  }

  const { rows } = await query(
    "UPDATE client_tbl SET client_fullname = $1, client_email = $2, client_phonenum = $3, client_password = $4, client_status = $5, client_last_updated_by = $6 WHERE client_id = $7 RETURNING *",
    [
      client_fullname,
      client_email,
      client_phonenum,
      hashedPassword,
      client_status,
      client_last_updated_by,
      clientId,
    ]
  );
  return rows[0];
};

// Deleting a client by ID
export const deleteClientById = async (clientId) => {
  const { rows } = await query(
    "DELETE FROM client_tbl WHERE client_id = $1 RETURNING *",
    [clientId]
  );
  return rows[0];
};

// Searching for a client
export const searchClients = async (searchTerm) => {
  const { rows } = await query(
    "SELECT * FROM client_tbl WHERE client_fullname ILIKE $1 OR client_email ILIKE $1 OR client_phonenum ILIKE $1",
    [`%${searchTerm}%`]
  );
  return rows;
};

// ---------------- SERVICES OR QUERIES FOR CLIENT CONTACTS

// Fetching all client contacts
export const getClientContacts = async () => {
  const { rows } = await query(
    `SELECT * FROM client_contact_tbl, client_tbl
    WHERE client_contact_tbl.client_id = client_tbl.client_id AND client_tbl.client_status != 'Removed'`
  );
  return rows;
};

// Fetching a lawyer's clients' contacts
export const getLawyersClientContacts = async (lawyerUserId) => {
  const { rows } = await query(
    `
    SELECT *
    FROM client_contact_tbl AS cc
    JOIN client_tbl AS c 
        ON cc.client_id = c.client_id
    JOIN user_tbl AS u
        ON c.created_by = u.user_id
    WHERE u.user_id = $1 AND c.client_status != 'Removed'
    `,
    [lawyerUserId]
  );

  return rows;
};

// Adding a new client contact
export const createClientContact = async (contactData) => {
  const {
    contact_fullname,
    contact_email,
    contact_phone,
    contact_role,
    client_id,
  } = contactData;
  const { rows } = await query(
    "INSERT INTO client_contact_tbl (contact_fullname, contact_email, contact_phone, contact_role, client_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [contact_fullname, contact_email, contact_phone, contact_role, client_id]
  );
  return rows[0];
};

// Updating an existing client contact
export const updateClientContact = async (contact_id, contactData) => {
  const {
    contact_fullname,
    contact_email,
    contact_phone,
    contact_role,
    client_id,
  } = contactData;
  const { rows } = await query(
    "UPDATE client_contact_tbl SET contact_fullname = $1, contact_email = $2, contact_phone = $3, contact_role = $4, client_id = $5 WHERE contact_id = $6 RETURNING *",
    [
      contact_fullname,
      contact_email,
      contact_phone,
      contact_role,
      client_id,
      contact_id,
    ]
  );
  return rows[0];
};

// Deleting a client contact by ID
export const deleteClientContactById = async (contact_id) => {
  const { rows } = await query(
    "DELETE FROM client_contact_tbl WHERE contact_id = $1 RETURNING *",
    [contact_id]
  );
  return rows[0];
};

// searching for client contacts
export const searchClientContacts = async (searchTerm) => {
  const { rows } = await query(
    "SELECT * FROM client_contact_tbl WHERE contact_fullname ILIKE $1 OR contact_email ILIKE $1 OR contact_phone ILIKE $1",
    [`%${searchTerm}%`]
  );
  return rows;
};
