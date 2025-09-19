import express from "express";

import * as clientController from "../controllers/clientController.js";
import verifyUser from "../middleware/verifyUser.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// Routes
router.get("/clients", verifyUser, clientController.getClients);
router.get("/all-clients", verifyUser, clientController.getAllClients); // only for ADMIN
router.post("/clients", verifyUser, clientController.createClient);
router.put("/clients/:client_id", verifyUser, clientController.updateClient);
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
router.get(
  "/clients/:user_id",
  verifyUser,
  clientController.getClientsByLawyerId // this api gets the clients of a certain lawyer
);

// Routes for Client Contacts
router.get("/client-contacts", verifyUser, clientController.getClientContacts);
router.get(
  "/a-lawyer-client-contacts/:user_id",
  verifyUser,
  clientController.getLawyersClientContacts
);
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
  clientController.deleteClientContactById
);
router.get(
  "/client-contacts/search",
  verifyUser,
  requireAdmin,
  clientController.searchClientContacts
);

export default router;
