// ----------------  SERVICES or QUERIES for the Branches of the BOS Law Firm

import { query } from "../db.js";

// Fetching All Users from the user_tbl
export const getBranches = async () => {
  const { rows } = await query(
    "SELECT * FROM branch_tbl ORDER BY branch_id ASC"
  );
  return rows;
};

// Find a branch by name
export const findBranchByName = async (branch_name) => {
  const { rows } = await query(
    "SELECT * FROM branch_tbl WHERE branch_name = $1",
    [branch_name]
  );
  return rows[0];
};

// Create a new branch
export const createBranch = async ({ branch_name, address, date_opened }) => {
  const existing = await findBranchByName(branch_name);
  if (existing) {
    const error = new Error("Branch name already exists");
    error.code = "ALREADY_EXISTS";
    throw error;
  }

  // Check if the address and date_opened columns exist, if not, only insert branch_name
  try {
    // Try with all columns first
    const { rows } = await query(
      "INSERT INTO branch_tbl (branch_name, address, date_opened) VALUES ($1, $2, $3) RETURNING *",
      [branch_name, address || null, date_opened || null]
    );
    return rows[0];
  } catch (err) {
    // If it fails due to missing columns, fall back to just branch_name
    if (err.code === "42703") {
      // undefined column error
      console.log(
        "Falling back to basic branch creation - some columns missing"
      );
      const { rows } = await query(
        "INSERT INTO branch_tbl (branch_name) VALUES ($1) RETURNING *",
        [branch_name]
      );
      return rows[0];
    }
    throw err;
  }
};

// Update an existing branch by id
export const updateBranch = async ({
  id,
  branch_name,
  address,
  date_opened,
}) => {
  try {
    // Try with all columns first
    const { rows } = await query(
      "UPDATE branch_tbl SET branch_name = $1, address = $2, date_opened = $3 WHERE branch_id = $4 RETURNING *",
      [branch_name, address || null, date_opened || null, id]
    );
    return rows[0];
  } catch (err) {
    // If it fails due to missing columns, fall back to just branch_name
    if (err.code === "42703") {
      // undefined column error
      console.log("Falling back to basic branch update - some columns missing");
      const { rows } = await query(
        "UPDATE branch_tbl SET branch_name = $1 WHERE branch_id = $2 RETURNING *",
        [branch_name, id]
      );
      return rows[0];
    }
    throw err;
  }
};

// Delete a branch by id
export const deleteBranch = async (id) => {
  const { rows } = await query(
    "DELETE FROM branch_tbl WHERE branch_id = $1 RETURNING *",
    [id]
  );
  return rows[0];
};
