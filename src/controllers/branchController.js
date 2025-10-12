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
    const { branch_name } = req.body || {};
    if (!branch_name || !branch_name.toString().trim()) {
      return res.status(400).json({ message: "branch name is required" });
    }
    const created = await branchService.createBranch({
      branch_name: branch_name.toString().trim(),
    });
    return res.status(201).json(created);
  } catch (err) {
    if (err.code === "ALREADY_EXISTS") {
      return res.status(409).json({ message: "Branch name already exists" });
    }
    console.error("Error creating branch", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update branch
export const updateBranch = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id)
      return res.status(400).json({ message: "Valid id param is required" });
    const { branch_name } = req.body || {};
    if (!branch_name || !branch_name.toString().trim()) {
      return res.status(400).json({ message: "branch_name is required" });
    }
    const updated = await branchService.updateBranch({
      id,
      branch_name: branch_name.toString().trim(),
    });
    if (!updated) return res.status(404).json({ message: "Branch not found" });
    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating branch", err);
    return res.status(500).json({ message: "Internal Server Error" });
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
