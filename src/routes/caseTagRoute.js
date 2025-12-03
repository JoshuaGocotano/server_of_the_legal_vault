import express from "express";

import * as caseTagController from "../controllers/caseTagController.js";
import verifyUser from "../middleware/verifyUser.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// Get all case tags
router.get("/case-tags", verifyUser, caseTagController.getCaseTags);

// Create a new case tag
router.post(
  "/case-tags",
  verifyUser,
  caseTagController.createCaseTag
);

// Update a case tag
router.put(
  "/case-tags/:id",
  verifyUser,
  requireAdmin,
  caseTagController.updateCaseTag
);

// Delete a case tag
// router.delete(
//   "/case-tags/:id",
//   verifyUser,
//   requireAdmin,
//   caseTagController.deleteCaseTag
// );

export default router;