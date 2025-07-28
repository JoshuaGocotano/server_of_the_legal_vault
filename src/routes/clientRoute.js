import express from "express";

import * as clientController from "../controllers/clientController.js";

const router = express.Router();

// Routes
router.get("/clients", clientController.getClients);
router.post("/clients", clientController.createClient);
router.put("/clients/:client_id", clientController.updateClient);
router.delete("/clients/:client_id", clientController.deleteClientById);
router.get("/clients/search", clientController.searchClients);

// Routes for Client Contacts
router.get("/client-contacts", clientController.getClientContacts);
router.post("/client-contacts", clientController.createClientContact);
router.put(
  "/client-contacts/:contact_id",
  clientController.updateClientContact
);
router.delete(
  "/client-contacts/:contact_id",
  clientController.deleteClientContactById
);
router.get("/client-contacts/search", clientController.searchClientContacts);

export default router;
