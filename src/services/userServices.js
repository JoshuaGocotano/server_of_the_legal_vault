import { query } from "../db.js";

export const getUsers = async () => {
  const { rows } = await query("SELECT * FROM user_tbl");
  return rows;
};
