import express from "express";
import verifyUser from "../middleware/verifyUser.js";
import requireAdmin from "../middleware/requireAdmin.js";
import * as reportController from "../controllers/reportController.js";

const router = express.Router();

router.get(
  "/reports/last-week",
  verifyUser,
  requireAdmin,
  reportController.getLastWeekCounts
);
router.get(
  "/reports/monthly",
  verifyUser,
  requireAdmin,
  reportController.getMonthlyCounts
);

// Case counts
router.get("/reports/case-counts", verifyUser, reportController.getCaseCounts);
// Case counts by category
router.get("/reports/case-counts-by-category", verifyUser, reportController.getCaseCountsByCategory);

export default router;
