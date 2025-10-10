import express from "express";

import * as branchController from "../controllers/branchController.js";
import verifyUser from "../middleware/verifyUser.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/branches", verifyUser, branchController.getBranches);
router.post(
  "/branches",
  verifyUser,
  requireAdmin,
  branchController.createBranch
);
router.put(
  "/branches/:id",
  verifyUser,
  requireAdmin,
  branchController.updateBranch
);
router.delete(
  "/branches/:id",
  verifyUser,
  requireAdmin,
  branchController.deleteBranch
);

export default router;
