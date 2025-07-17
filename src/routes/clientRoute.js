import express from "express";

import * as clientController from "../controllers/clientController.js";

const router = express.Router();

// Routes
router.get("/clients/:client_id", clientController.getClientById);

export default router;
