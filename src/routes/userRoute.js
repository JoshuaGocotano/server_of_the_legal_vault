import express from "express";

import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/users", userController.getUsers);
router.post("/users", userController.createUser);
router.put("/users/:user_id", userController.updateUser);
router.delete("/users/:user_id", userController.deleteUser);
router.get("/users/search", userController.searchUsers);

export default router;
