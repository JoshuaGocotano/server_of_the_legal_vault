import express from "express";

import * as caseController from "../controllers/caseController.js";
import verifyUser from "../middleware/verifyUser.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/cases", caseController.getCases);
router.get("/cases/:case_id", caseController.getCaseById);
router.post("/cases", caseController.createCase);

export default router;
