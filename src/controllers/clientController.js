import * as clientServices from "../services/clientServices.js";

export const getClients = async (req, res) => {
  try {
    const client = await clientServices.getClients();
    res.status(200).json(client);
  } catch (err) {
    console.error("Error fetching clients", err);
    res.status(500).json({ message: "Internal Sever Error" });
  }
};
