import express from "express";

import * as caseController from "../controllers/caseController.js";
import verifyUser from "../middleware/verifyUser.js";
import requireAdmin from "../middleware/requireAdmin.js";
import requireAdminOrLawyer from "../middleware/requireAdminOrLawyer.js";

const router = express.Router();

router.get("/cases", verifyUser, caseController.getCases);
router.get("/cases/user/:user_id", verifyUser, caseController.getCasesByUserId); // Fetch cases of a specific lawyer

// for dashboard counts
router.get(
  "/cases/count/processing",
  verifyUser,
  caseController.countProcessingCases
); // Count all processing cases
router.get(
  "/cases/count/archived",
  verifyUser,
  caseController.countArchivedCases
); // Count all archived cases - admins and lawyers only
router.get(
  "/cases/count/processing/user/:user_id",
  verifyUser,
  caseController.countProcessingCasesByUserId
); // Count processing cases of a specific lawyer
router.get(
  "/cases/count/archived/user/:user_id",
  verifyUser,
  caseController.countArchivedCasesByUserId
); // Count archived cases of a specific lawyer

router.post("/cases", caseController.createCase);
router.put("/cases/:case_id", caseController.updateCase);
router.delete("/cases/:case_id", caseController.deleteCase);
router.get("/cases/search", caseController.searchCases);
router.get("/cases/:case_id", caseController.getCaseById);

// Routes for case categories and types
router.get("/case-categories", caseController.getCaseCategories);
router.get("/case-category-types", caseController.getCaseCategoryTypes);
router.post("/case-categories", verifyUser, caseController.createCaseCategory);
router.post("/case-category-types", verifyUser, caseController.createCaseType);

export default router;
