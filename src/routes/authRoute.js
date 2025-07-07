import express from "express";
import { query } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { rows } = await query(
      "SELECT * FROM user_tbl WHERE user_email = $1",
      [email]
    );
    const user = rows[0];

    if (!user) return res.status(401).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_email: user.user_email,
        user_fname: user.user_fname,
        user_lname: user.user_lname,
        user_role: user.user_role,
      },
      "jwt-secret-key",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    delete user.user_password;
    res.json({ user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Session Check Route
router.get("/verify", verifyUser, (req, res) => {
  res.json({
    status: "success",
    message: "User is authenticated",
    user: req.user, // contains user_id, name, role, etc.
  });
});

// For logging out
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
  });

  return res.json({ message: "Logged out successfully" });
});

export default router;
