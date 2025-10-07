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

// Fetch documents by Case ID
export const getDocumentsByCaseId = async (req, res) => {
  const { caseId } = req.params;
  try {
    const documents = await documentService.getDocumentsByCaseId(caseId);
    res.status(200).json(documents);
  } catch (err) {
    console.error("Error fetching documents by Case ID", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Creating a New Document
export const createDocument = async (req, res) => {
  try {
    const mainFile = req.files["doc_file"] ? req.files["doc_file"][0].filename : null;
    const references = req.files["doc_reference"] 
      ? req.files["doc_reference"].map(f => f.filename) 
      : [];

    // Save to DB
    const docData = {
      ...req.body,
      doc_file: mainFile ? `/uploads/${req.body.doc_type === "Tasked" ? "taskedDocs" : "supportingDocs"}/${mainFile}` : null,
      doc_reference: references.length ? JSON.stringify(references.map(f => `/uploads/referenceDocs/${f}`)) : null
    };

    // Call your service/DB insert
    const newDoc = await documentService.createDocument(docData);

    res.status(201).json(newDoc);
  } catch (err) {
    console.error("Error creating document:", err);
    res.status(500).json({ error: "Failed to create document" });
  }
};

// Updating an Existing Document
export const updateDocument = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedDoc = await documentService.updateDocument(id, req.body);
    if (!updatedDoc) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(updatedDoc);
  } catch (err) {
    console.error("Error updating document:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Deleting a Document
export const deleteDocument = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await documentService.deleteDocument(id);
    if (!deleted) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("Error deleting document:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
