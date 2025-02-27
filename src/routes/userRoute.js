import express from "express";

import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/users", userController.getUsers);

export default router;
