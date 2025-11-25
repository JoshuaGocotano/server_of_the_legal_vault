import * as caseTagService from "../services/caseTagServices.js";

// ================================
// Fetch All Case Tags
// ================================
export const getCaseTags = async (req, res) => {
  try {
    const tags = await caseTagService.getCaseTags();
    return res.status(200).json(tags);
  } catch (err) {
    console.error("Error fetching case tags:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================================
// Create Case Tag
// ================================
export const createCaseTag = async (req, res) => {
  try {
    const { ctag_name, ctag_sequence_num, ctag_created_by } = req.body || {};

    console.log("Create case tag request body:", req.body);

    if (!ctag_name || !ctag_name.toString().trim()) {
      return res.status(400).json({ message: "ctag_name is required" });
    }

    const created = await caseTagService.createCaseTag({
      ctag_name: ctag_name.toString().trim(),
      ctag_sequence_num: ctag_sequence_num ? Number(ctag_sequence_num) : null,
      ctag_created_by: ctag_created_by ? Number(ctag_created_by) : null,
    });

    return res.status(201).json(created);
  } catch (err) {
    if (err.code === "ALREADY_EXISTS") {
      return res.status(409).json({ message: "Case tag already exists" });
    }

    console.error("Error creating case tag:", err.message, err.stack);
    return res.status(500).json({
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// ================================
// Update Case Tag
// ================================
export const updateCaseTag = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "Valid id param is required" });
    }

    const { ctag_name, ctag_sequence_num, ctag_created_by } = req.body || {};

    console.log("Update case tag request:", { id, body: req.body });

    if (!ctag_name || !ctag_name.toString().trim()) {
      return res.status(400).json({ message: "ctag_name is required" });
    }

    const updated = await caseTagService.updateCaseTag({
      id,
      ctag_name: ctag_name.toString().trim(),
      ctag_sequence_num: ctag_sequence_num ? Number(ctag_sequence_num) : null,
      ctag_created_by: ctag_created_by ? Number(ctag_created_by) : null,
    });

    if (!updated) {
      return res.status(404).json({ message: "Case tag not found" });
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error("Error updating case tag:", err.message, err.stack);
    return res.status(500).json({
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// ================================
// Delete Case Tag
// ================================
// export const deleteCaseTag = async (req, res) => {
//   try {
//     const id = Number(req.params.id);

//     if (!id) {
//       return res.status(400).json({ message: "Valid id param is required" });
//     }

//     const deleted = await caseTagService.deleteCaseTag(id);

//     if (!deleted) {
//       return res.status(404).json({ message: "Case tag not found" });
//     }

//     return res.status(204).send();
//   } catch (err) {
//     console.error("Error deleting case tag:", err);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };