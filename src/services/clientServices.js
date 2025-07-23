// ----------------  SERVICES or QUERIES

import { query } from "../db.js";

// Fetching all clients
export const getClients = async () => {
  const { rows } = await query(
    "SELECT * FROM client_tbl ORDER BY client_id ASC"
  );
  return rows;
};

// Adding a new client
export const createClient = async (clientData) => {
  const { client_fullname, client_email, client_phonenum, created_by } =
    clientData;
  const { rows } = await query(
    "INSERT INTO client_tbl (client_fullname, client_email, client_phonenum, created_by) VALUES ($1, $2, $3, $4) RETURNING *",
    [client_fullname, client_email, client_phonenum, created_by]
  );
  return rows[0];
};

// Updating an existing client
export const updateClient = async (clientId, clientData) => {
  const { client_fullname, client_email, client_phonenum } = clientData;
  const { rows } = await query(
    "UPDATE client_tbl SET client_fullname = $1, client_email = $2, client_phonenum = $3 WHERE client_id = $4 RETURNING *",
    [client_fullname, client_email, client_phonenum, clientId]
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
    "SELECT * FROM client_contact_tbl ORDER BY cc_id"
  );
  return rows;
};

// Adding a new client contact
export const createClientContact = async (contactData) => {
  const { cc_fullname, cc_email, cc_phone, cc_role, cc_client } = contactData;
  const { rows } = await query(
    "INSERT INTO client_contact_tbl (cc_fullname, cc_email, cc_phone, cc_role, cc_client) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [cc_fullname, cc_email, cc_phone, cc_role, cc_client]
  );
  return rows[0];
};

// Updating an existing client contact
export const updateClientContact = async (cc_id, contactData) => {
  const { cc_fullname, cc_email, cc_phone, cc_role } = contactData;
  const { rows } = await query(
    "UPDATE client_contact_tbl SET cc_fullname = $1, cc_email = $2, cc_phone = $3, cc_role = $4 WHERE cc_id = $5 RETURNING *",
    [cc_fullname, cc_email, cc_phone, cc_role, cc_id]
  );
  return rows[0];
};

// Deleting a client contact by ID
export const deleteClientContactById = async (cc_id) => {
  const { rows } = await query(
    "DELETE FROM client_contact_tbl WHERE cc_id = $1 RETURNING *",
    [cc_id]
  );
  return rows[0];
};

// searching for client contacts
export const searchClientContacts = async (searchTerm) => {
  const { rows } = await query(
    "SELECT * FROM client_contact_tbl WHERE cc_fullname ILIKE $1 OR cc_email ILIKE $1 OR cc_phone ILIKE $1",
    [`%${searchTerm}%`]
  );
  return rows;
};
