// ----------------  SERVICES or QUERIES

import { query } from "../db.js";

// Fetching a specific client by ID
export const getClientById = async (clientId) => {
  const { rows } = await query(
    "SELECT * FROM client_tbl WHERE client_id = $1",
    [clientId]
  );
  return rows[0];
};

//Fetching all clients
export const getClients = async () => {
  const { rows } = await query("SELECT * FROM client_tbl ORDER BY client_id ASC");
  return rows;
};

