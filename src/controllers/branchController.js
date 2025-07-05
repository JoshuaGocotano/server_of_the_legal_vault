import * as branchService from "../services/branchServices.js";

// Fetching All Branches
export const getBranches = async (req, res) => {
  try {
    const branch = await branchService.getBranches();
    res.status(200).json(branch);
  } catch (err) {
    console.error("Error fetching branches", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
