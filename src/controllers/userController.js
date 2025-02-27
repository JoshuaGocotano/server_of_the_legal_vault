import * as userService from "../services/userServices.js";

export const getUsers = async (req, res) => {
  try {
    const user = await userService.getUsers();
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching clients", err);
    res.status(500).json({ message: "Internal Sever Error" });
  }
};
