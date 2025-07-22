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
