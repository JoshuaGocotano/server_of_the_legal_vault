// ----------------  SERVICES or QUERIES

import { query } from "../db.js";
import bcrypt from "bcrypt";

const saltRounds = 10;

// Fetching a specific user by ID
export const getUserById = async (userId) => {
  const { rows } = await query("SELECT * FROM user_tbl WHERE user_id = $1", [
    userId,
  ]);
  return rows[0];
};

// Fetching All Users from the user_tbl
export const getUsers = async () => {
  const { rows } = await query("SELECT * FROM user_tbl ORDER BY user_id ASC");
  return rows;
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
      user_status,
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
      branch_id = $10
    WHERE user_id = $11
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
