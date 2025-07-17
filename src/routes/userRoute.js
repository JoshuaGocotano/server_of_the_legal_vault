import express from "express";
import multer from "multer";
import path from "path";
import * as userController from "../controllers/userController.js";
import verifyUser from "../middleware/verifyUser.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "D:/Capstone_ni_Angelie/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and JPG files are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

// Routes
router.get(
  "/users/:user_id",
  verifyUser,
  requireAdmin,
  userController.getUserById
);
router.get("/users", verifyUser, requireAdmin, userController.getUsers);
router.post(
  "/users",
  verifyUser,
  requireAdmin,
  upload.single("user_profile"),
  userController.createUser
);
router.put(
  "/users/:user_id",
  // verifyUser,
  // requireAdmin,
  upload.single("user_profile"),
  userController.updateUser
);
router.delete(
  "/users/:user_id",
  verifyUser,
  requireAdmin,
  userController.deleteUser
);
router.get(
  "/users/search",
  verifyUser,
  requireAdmin,
  userController.searchUsers
);

export default router;
