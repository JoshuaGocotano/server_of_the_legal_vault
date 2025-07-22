import * as clientService from "../services/clientServices.js";

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

// Adding a new client
export const createClient = async (req, res) => {
  try {
    const clientData = req.body;
    const newClient = await clientService.createClient(clientData);
    res.status(201).json(newClient);
  } catch (err) {
    console.error("Error creating client", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Updating an existing client
export const updateClient = async (req, res) => {
  try {
    const clientId = req.params.client_id;
    const clientData = req.body;
    const updatedClient = await clientService.updateClient(
      clientId,
      clientData
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(updatedClient);
  } catch (err) {
    console.error("Error updating client", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Deleting a client by ID
export const deleteClientById = async (req, res) => {
  try {
    const clientId = req.params.client_id;
    const deletedClient = await clientService.deleteClientById(clientId);

    if (!deletedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (err) {
    console.error("Error deleting client", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Searching for clients
export const searchClients = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const clients = await clientService.searchClients(searchTerm);
    res.status(200).json(clients);
  } catch (err) {
    console.error("Error searching clients", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// CONTROLLER FOR CLIENT CONTACTS

// Fetching all client contacts
export const getClientContacts = async (req, res) => {
  try {
    const contacts = await clientService.getClientContacts();
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Error fetching client contacts", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Adding a new client contact here...
