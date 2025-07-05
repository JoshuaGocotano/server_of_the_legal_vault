// routes/userRoute.js
import express from "express";
import * as userController from "../controllers/userController.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();

// 🛡️ Protect all user routes
router.get("/users", verifyUser, userController.getUsers);
router.post("/users", verifyUser, userController.createUser);
router.put("/users/:user_id", verifyUser, userController.updateUser);
router.delete("/users/:user_id", verifyUser, userController.deleteUser);
router.get("/users/search", verifyUser, userController.searchUsers);

export default router;
