// ----------------  SERVICES or QUERIES for the Branches of the BOS Law Firm

import { query } from "../db.js";

// Fetching All Users from the user_tbl
export const getBranches = async () => {
  const { rows } = await query(
    "SELECT * FROM branch_tbl ORDER BY branch_id ASC"
  );
  return rows;
};
