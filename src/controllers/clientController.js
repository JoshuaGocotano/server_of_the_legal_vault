import * as clientService from "../services/clientServices.js";

// Fetching a specific client by ID
export const getClientById = async (req, res) => {
  try {
    const clientId = req.params.client_id;
    const client = await clientService.getClientById(clientId);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);
  } catch (err) {
    console.error("Error fetching client by ID", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//Fetching all clients
export const getClients = async (req, res) => {
  try {
    const client = await clientService.getClients();
    res.status(200).json(client);
  } catch (err) {
    console.error("Error fetching clients", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

