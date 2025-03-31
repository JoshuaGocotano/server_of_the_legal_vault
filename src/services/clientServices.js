import { query } from "../db.js";

export const getClients = async () => {
  const { rows } = await query("SELECT * FROM admin_tbl");
  return rows;
};

export const createClient = async (clientData) => {
  const {
    a_fname,
    a_lname,
    a_email,
    a_password,
    a_address,
    a_contactnum,
    a_department,
    a_status,
  } = clientData;

  const { rows } = await query(
    "INSERT INTO admin_tbl (a_fname, a_lname, a_email, a_password, a_address, a_contactnum, a_department, a_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [
      a_fname,
      a_lname,
      a_email,
      a_password,
      a_address,
      a_contactnum,
      a_department,
      a_status,
    ]
  );

  return rows[0];
};

export const updateClient = async (clientId, clientData) => {
  const {
    a_fname,
    a_lname,
    a_email,
    a_password,
    a_address,
    a_contactnum,
    a_department,
    a_status,
  } = clientData;

  const { rows } = await query(
    `UPDATE admin_tbl SET a_fname = $1, a_lname = $2, a_email = $3, a_password = $4, a_address = $5, a_contactnum = $6, a_department = $7, a_status = $8 WHERE a_id = $9 RETURNING *`,
    [
      a_fname,
      a_lname,
      a_email,
      a_password,
      a_address,
      a_contactnum,
      a_department,
      a_status,
      clientId,
    ]
  );

  return rows[0];
};
