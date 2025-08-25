import express from "express";

import * as paymentController from "../controllers/paymentController.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();

router.get("/payments", verifyUser, paymentController.getPayments);
router.get(
  "/payments/:lawyer_id",
  verifyUser,
  paymentController.getPaymentsByLawyerId
);

export default router;
