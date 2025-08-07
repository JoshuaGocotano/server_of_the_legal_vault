import express from "express";

import * as clientController from "../controllers/clientController.js";
import verifyUser from "../middleware/verifyUser.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// Routes
router.get("/clients", clientController.getClients);
router.get("/all-clients", clientController.getAllClients);
router.get(
  "/clients/:user_id",
  verifyUser,
  clientController.getClientsByLawyerId // this api gets the clients of a certain lawyer
);
router.post("/clients", clientController.createClient);
router.put("/clients/:client_id", clientController.updateClient);
router.delete(
  "/clients/:client_id",
  verifyUser,
  requireAdmin,
  clientController.deleteClientById
);
router.get(
  "/clients/search",
  verifyUser,
  requireAdmin,
  clientController.searchClients
);

// Routes for Client Contacts
router.get("/client-contacts", verifyUser, clientController.getClientContacts);
router.post(
  "/client-contacts",
  verifyUser,
  clientController.createClientContact
);
router.put(
  "/client-contacts/:contact_id",
  verifyUser,
  clientController.updateClientContact
);
router.delete(
  "/client-contacts/:contact_id",
  verifyUser,
  requireAdmin,
  clientController.deleteClientContactById
);
router.get(
  "/client-contacts/search",
  verifyUser,
  requireAdmin,
  clientController.searchClientContacts
);

export default router;
