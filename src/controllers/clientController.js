import * as clientService from "../services/clientServices.js";

export const getClients = async (req, res) => {
  try {
    const client = await clientService.getClients();
    res.status(200).json(client);
  } catch (err) {
    console.error("Error fetching clients", err);
    res.status(500).json({ message: "Internal Sever Error" });
  }
};

// Add client or admin to the database
export const createClient = async (req, res) => {
  try {
    const clientData = req.body;
    const newClient = await clientService.createClient(clientData);
    res.status(200).json(newClient);
  } catch (err) {
    console.error("Error adding clients", err);
    res.status(500).json({ message: "Internal Sever Error" });
  }
};

// Update client or admin in the database
export const updateClient = async (req, res) => {
  try {
    const clientId = req.params.a_id;
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
    res.status(500).json({ message: "Internal Sever Error" });
  }
};
