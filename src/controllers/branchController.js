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

// Create branch
export const createBranch = async (req, res) => {
  try {
    const { branch_name, address, date_opened } = req.body || {};

    console.log("Create branch request body:", req.body);

    if (!branch_name || !branch_name.toString().trim()) {
      return res.status(400).json({ message: "branch name is required" });
    }

    const created = await branchService.createBranch({
      branch_name: branch_name.toString().trim(),
      address: address ? address.toString().trim() : null,
      date_opened: date_opened || null,
    });

    return res.status(201).json(created);
  } catch (err) {
    if (err.code === "ALREADY_EXISTS") {
      return res.status(409).json({ message: "Branch name already exists" });
    }
    console.error("Error creating branch:", err.message, err.stack);
    return res.status(500).json({
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Update branch
export const updateBranch = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id)
      return res.status(400).json({ message: "Valid id param is required" });

    const { branch_name, address, date_opened } = req.body || {};

    console.log("Update branch request:", { id, body: req.body });

    if (!branch_name || !branch_name.toString().trim()) {
      return res.status(400).json({ message: "branch_name is required" });
    }

    const updated = await branchService.updateBranch({
      id,
      branch_name: branch_name.toString().trim(),
      address: address ? address.toString().trim() : null,
      date_opened: date_opened || null,
    });

    if (!updated) return res.status(404).json({ message: "Branch not found" });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating branch:", err.message, err.stack);
    return res.status(500).json({
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Delete branch
export const deleteBranch = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id)
      return res.status(400).json({ message: "Valid id param is required" });
    const deleted = await branchService.deleteBranch(id);
    if (!deleted) return res.status(404).json({ message: "Branch not found" });
    return res.status(204).send();
  } catch (err) {
    console.error("Error deleting branch", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
