import express from "express";

import * as clientController from "../controllers/clientController.js";

const router = express.Router();

// Routes
router.get("/clients", clientController.getClients);
router.post("/clients", clientController.createClient);
router.put("/clients/:client_id", clientController.updateClient);
router.delete("/clients/:client_id", clientController.deleteClientById);
router.get("/clients/search", clientController.searchClients);

export default router;
