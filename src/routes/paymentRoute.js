import express from "express";

import * as paymentController from "../controllers/paymentController.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();

router.get("/payments", paymentController.getPayments);
router.get("/payments/case/:case_id", paymentController.getPaymentsByCaseId);
router.get(
  "/payments/lawyer/:lawyer_id",
  paymentController.getPaymentsByLawyerId
);
router.post("/payments", paymentController.addPayment);
router.delete("/payments/:payment_id", paymentController.deletePayment);

export default router;
