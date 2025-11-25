// SERVICES FOR CASE TAG LIST
// Case tag list is a sequence list of tags indicating the progress of a processing case

import { query } from "../db.js";

// Fetching All Case Tags
export const getCaseTags = async () => {
  const { rows } = await query(
    "SELECT * FROM case_tag_tbl ORDER BY ctag_id ASC"
  );
  return rows;
};

// Find a Case Tag by Name
export const findCaseTagByName = async (ctag_name) => {
  const { rows } = await query(
    "SELECT * FROM case_tag_tbl WHERE ctag_name = $1",
    [ctag_name]
  );
  return rows[0];
};

// Create a new Case Tag
export const createCaseTag = async ({ ctag_name, ctag_sequence_num, ctag_created_by }) => {
  const existing = await findCaseTagByName(ctag_name);
  if (existing) {
    const error = new Error("Case Tag already exists");
    error.code = "ALREADY_EXISTS";
    throw error;
  }

  try {
    const { rows } = await query(
      `INSERT INTO case_tag_tbl 
        (ctag_name, ctag_sequence_num, ctag_date_created, ctag_created_by) 
       VALUES ($1, $2, NOW(), $3) 
       RETURNING *`,
      [ctag_name, ctag_sequence_num || null, ctag_created_by || null] // provide default if null
    );

    return rows[0];
  } catch (err) {
    if (err.code === "42703") {
      console.log("Fallback: inserting only ctag_name");

      const { rows } = await query(
        "INSERT INTO case_tag_tbl (ctag_name) VALUES ($1) RETURNING *",
        [ctag_name]
      );

      return rows[0];
    }

    throw err;
  }
};


// Update Case Tag by ID
export const updateCaseTag = async ({ id, ctag_name, ctag_sequence_num, ctag_created_by }) => {
  try {
    const { rows } = await query(
      `UPDATE case_tag_tbl 
       SET ctag_name = $1, ctag_sequence_num = $2, ctag_created_by = $3
       WHERE ctag_id = $4 
       RETURNING *`,
      [ctag_name, ctag_sequence_num || null, ctag_created_by || null, id]
    );

    return rows[0];
  } catch (err) {
    if (err.code === "42703") {
      console.log("Fallback: updating only ctag_name");

      const { rows } = await query(
        `UPDATE case_tag_tbl 
         SET ctag_name = $1 
         WHERE ctag_id = $2 
         RETURNING *`,
        [ctag_name, id]
      );

      return rows[0];
    }

    throw err;
  }
};


// Delete Case Tag
// export const deleteCaseTag = async (id) => {
//   const { rows } = await query(
//     "DELETE FROM case_tag_tbl WHERE ctag_id = $1 RETURNING *",
//     [id]
//   );
//   return rows[0];
// };
