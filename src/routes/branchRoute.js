import express from "express";

import * as branchController from "../controllers/branchController.js";
import verifyUser from "../middleware/verifyUser.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/branches", branchController.getBranches);

export default router;
