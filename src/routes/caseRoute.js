import express from "express";

import * as caseController from "../controllers/caseController.js";
import verifyUser from "../middleware/verifyUser.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/cases", caseController.getCases);
router.get("/cases/user/:user_id", caseController.getCasesByUserId); // Fetch cases of a specific lawyer
router.post("/cases", caseController.createCase);
router.put("/cases/:case_id", caseController.updateCase);
router.delete("/cases/:case_id", caseController.deleteCase);
router.get("/cases/search", caseController.searchCases);
router.get("/cases/:case_id", caseController.getCaseById);

export default router;
