import * as documentService from "../services/documentServices.js";

// Fetching All Documents
export const getDocuments = async (req, res) => {
  try {
    const document = await documentService.getDocuments();
    res.status(200).json(document);
  } catch (err) {
    console.error("Error fetching documents", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetching a Single Document by ID
export const getDocumentById = async (req, res) => {
  const { id } = req.params;
  try {
    const document = await documentService.getDocumentById(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(document);
  } catch (err) {
    console.error("Error fetching document by ID", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Creating a New Document
export const createDocument = async (req, res) => {
  const data = req.body;
  try {
    const newDocument = await documentService.createDocument(data);
    res.status(201).json(newDocument);
  } catch (err) {
    console.error("Error creating document", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
