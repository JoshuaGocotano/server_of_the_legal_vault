import express from "express";

import * as clientController from "../controllers/clientController.js";

const router = express.Router();

router.get("/clients", clientController.getClients);

export default router;
