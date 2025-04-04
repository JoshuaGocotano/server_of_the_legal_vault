import express from "express";

import * as clientController from "../controllers/clientController.js";

const router = express.Router();

router.get("/clients", clientController.getClients);
router.post("/clients", clientController.createClient);
router.put("/clients/:a_id", clientController.updateClient);
router.delete("/clients/:a_id", clientController.deleteClient);

export default router;
