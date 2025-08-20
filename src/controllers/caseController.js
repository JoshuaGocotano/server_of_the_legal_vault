import * as caseServices from "../services/caseServices.js";

export const getCases = async (req, res) => {
  try {
    const cases = await caseServices.getCases();
    res.status(200).json(cases);
  } catch (err) {
    console.error("Error fetching cases", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCaseById = async (req, res) => {
  try {
    const caseId = req.params.case_id;
    const caseData = await caseServices.getCaseById(caseId);

    if (!caseData) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json(caseData);
  } catch (err) {
    console.error("Error fetching case by ID", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCasesByUserId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const cases = await caseServices.getCasesByUserId(userId);
    res.status(200).json(cases);
  } catch (err) {
    console.error("Error fetching cases by user ID", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createCase = async (req, res) => {
  try {
    const caseData = req.body;
    const newCase = await caseServices.createCase(caseData);
    res.status(201).json(newCase);
  } catch (err) {
    console.error("Error creating case", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCase = async (req, res) => {
  try {
    const caseId = req.params.case_id;
    const caseData = req.body;

    const updatedCase = await caseServices.updateCase(caseId, caseData);

    if (!updatedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json(updatedCase);
  } catch (err) {
    console.error("Error updating case", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCase = async (req, res) => {
  try {
    const caseId = req.params.case_id;
    const deletedCase = await caseServices.deleteCase(caseId);

    if (!deletedCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json({ message: "Case deleted successfully" });
  } catch (err) {
    console.error("Error deleting case", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchCases = async (req, res) => {
  try {
    const searchTerm = req.query.q || "";
    const cases = await caseServices.searchCases(searchTerm);
    res.status(200).json(cases);
  } catch (err) {
    console.error("Error searching cases", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
