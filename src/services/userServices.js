// ----------------  SERVICES or QUERIES

import { query } from "../db.js";

import bcrypt from "bcrypt";
const saltRounds = 10;

// Fetching All Users
export const getUsers = async () => {
  const { rows } = await query("SELECT * FROM user_tbl ORDER BY user_id");
  return rows;
};

// for dashboard user count
export const countUsers = async () => {
  const { rows } = await query("SELECT COUNT(*) FROM user_tbl");
  return rows[0].count;
};

// Adding a New User
export const createUser = async (userData) => {
  const {
    user_email,
    user_password,
    user_fname,
    user_mname,
    user_lname,
    user_phonenum,
    user_role,
    user_status,
    user_profile,
    created_by,
    branch_id,
  } = userData;

  // Hashing here
  const hashedPassword = await bcrypt.hash(
    user_password.toString(),
    saltRounds
  );

  const { rows } = await query(
    `INSERT INTO user_tbl (
      user_email, user_password, user_fname, user_mname, 
      user_lname, user_phonenum, user_role, user_status, user_profile, created_by, branch_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [
      user_email,
      hashedPassword,
      user_fname,
      user_mname,
      user_lname,
      user_phonenum,
      user_role,
      "Active",
      user_profile,
      created_by,
      branch_id,
    ]
  );

  return rows[0];
};

// Updating User Information
export const updateUser = async (userId, userData) => {
  let {
    user_email,
    user_password,
    user_fname,
    user_mname,
    user_lname,
    user_phonenum,
    user_role,
    user_status,
    user_profile,
    branch_id,
    user_last_updated_by,
  } = userData;

  let hashedPassword = null;
  if (user_password) {
    hashedPassword = await bcrypt.hash(user_password.toString(), saltRounds);
  } else {
    const { rows } = await query(
      "SELECT user_password FROM user_tbl WHERE user_id = $1",
      [userId]
    );
    hashedPassword = rows[0]?.user_password;
  }

  if (!user_profile) {
    const { rows } = await query(
      "SELECT user_profile FROM user_tbl WHERE user_id = $1",
      [userId]
    );
    user_profile = rows[0]?.user_profile;
  }

  const { rows } = await query(
    `UPDATE user_tbl SET 
      user_email = $1,
      user_password = $2,
      user_fname = $3,
      user_mname = $4,
      user_lname = $5,
      user_phonenum = $6,
      user_role = $7,
      user_status = $8,
      user_profile = $9,
      branch_id = $10,
      user_last_updated_by = $11
    WHERE user_id = $12
    RETURNING *`,
    [
      user_email,
      hashedPassword,
      user_fname,
      user_mname,
      user_lname,
      user_phonenum,
      user_role,
      user_status,
      user_profile,
      branch_id,
      user_last_updated_by,
      userId,
    ]
  );

  return rows[0];
};

// Deleting a User
export const deleteUser = async (userId) => {
  const { rows } = await query(
    "DELETE FROM user_tbl WHERE user_id = $1 RETURNING *",
    [userId]
  );

  return rows[0];
};

// Searching for a User
export const searchUsers = async (searchTerm) => {
  const { rows } = await query(
    `SELECT * FROM user_tbl
     WHERE user_fname ILIKE $1
        OR user_mname ILIKE $1
        OR user_lname ILIKE $1
        OR user_email ILIKE $1
        OR user_phonenum ILIKE $1
        OR user_role ILIKE $1
        OR user_status ILIKE $1`,
    [`%${searchTerm}%`]
  );

  return rows;
};

// --------- SERVICES or QUERIES FOR USER LOGS

// Fetching User Logs for Admin
export const getUserLogs = async () => {
  const { rows } = await query(
    `SELECT * FROM user_log_tbl ORDER BY user_log_time DESC`
  );
  return rows;
};

// Fetching User Logs for a Specific User
export const getUserLogsById = async (userId) => {
  const { rows } = await query(
    `SELECT * FROM user_log_tbl WHERE user_id = $1 ORDER BY user_log_time DESC`,
    [userId]
  );
  return rows;
};

// ---------- SERVICES or QUERIES FOR LAWYERS' CASE SPECIALTIES

export const getLawyersByCaseCategoryTypes = async () => {
  const { rows } = await query(
    `SELECT DISTINCT
	      cc.cc_id,
	      cc.cc_name,
        u.user_id,
        u.user_fname,
	      u.user_mname,
	      u.user_lname
      FROM case_tbl c
      JOIN case_category_tbl cc ON c.cc_id = cc.cc_id
      JOIN user_tbl u ON c.user_id = u.user_id
      ORDER BY cc.cc_id, u.user_fname;
    `
  );
  return rows;
};

// count how many admins exist
export const countAdmins = async () => {
  const { rows } = await query(
    "SELECT COUNT(*) FROM user_tbl WHERE user_role = 'Admin'"
  );
  return parseInt(rows[0].count, 10);
};

// updateUserRoleOnly for updating user role
export const updateUserRoleOnly = async (userId, newRole) => {
  const { rows } = await query(
    `UPDATE user_tbl SET
      user_role = $1
    WHERE user_id = $2
    RETURNING *`,
    [newRole, userId]
  );
  return rows[0];
};
