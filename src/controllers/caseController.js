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

export const createCase = async (req, res) => {
  try {
    const caseData = req.body;
    const newCase = await caseServices.createCase(caseData);
    res.status(201).json(newCase);
  } catch (err) {
    console.error("Error creating case", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
