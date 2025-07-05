import express from "express";

import * as branchController from "../controllers/branchController.js";

const router = express.Router();

router.get("/branches", branchController.getBranches);

export default router;
