import express from "express";
import { query } from "../db.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await query(
      "SELECT * FROM user_tbl WHERE user_email = $1",
      [email]
    );
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Remove password before sending back
    delete user.user_password;

    res.json({ user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
