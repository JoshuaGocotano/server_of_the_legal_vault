import { query } from "../db.js";

export const getClients = async () => {
  const { rows } = await query("SELECT * FROM admin_tbl");
  return rows;
};

export const createClient = async (clientData) => {
  const { fname, lname, email, passw, address, phone, dept, status } =
    clientData;
  const { rows } = await query(
    "INSERT INTO admin_tbl (a_fname, a_lname, a_email, a_password, a_address, a_contactnum, a_department, a_status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [fname, lname, email, passw, address, phone, dept, status]
  );

  return rows[0];
};
