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

// Fetching All Documents of Lawyer's Cases
export const getDocumentsByLawyer = async (req, res) => {
  const lawyerId = req.user.user_id;
  try {
    const documents = await documentService.getDocumentsByLawyer(lawyerId);
    res.status(200).json(documents);
  } catch (err) {
    console.error("Error fetching documents for lawyer", err);
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

// Get documents submitted by a specific user
export const getDocumentsBySubmitter = async (req, res) => {
  const { userId } = req.params;
  try {
    const documents = await documentService.getDocumentsBySubmitter(userId);
    res.status(200).json(documents);
  } catch (err) {
    console.error("Error fetching documents by Submitter ID", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch all task documents assigned to a specific user
export const getTaskDocumentsByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const documents = await documentService.getTaskDocumentsByUser(userId);
    res.status(200).json(documents);
  } catch (err) {
    console.error("Error fetching task documents by User ID", err);
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
    let body = { ...req.body };

    const mainFile = req.files["doc_file"] ? req.files["doc_file"][0].filename : null;
    const references = req.files["doc_reference"] 
      ? req.files["doc_reference"].map(f => f.filename) 
      : [];

    if (mainFile) {
      body.doc_file = `/uploads/${req.body.doc_type === "Tasked" ? "taskedDocs" : "supportingDocs"}/${mainFile}`;
    }
    if (references.length) {
      body.doc_reference = JSON.stringify(references.map(f => `/uploads/referenceDocs/${f}`));
    }
    
    const updatedDoc = await documentService.updateDocument(id, body);

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

// Searching Documents
export const searchDocuments = async (req, res) => {
  const { query } = req.query;
  try {
    const results = await documentService.searchDocuments(query);
    res.status(200).json(results);
  } catch (err) {
    console.error("Error searching documents:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Count documents with status "done" for dashboard
export const countForApprovalDocuments = async (req, res) => {
  try {
    const count = await documentService.countForApprovalDocuments();
    res.status(200).json({ count });
  } catch (err) {
    console.error("Error counting documents for approval:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Count documents with status "processing" for dashboard
export const countProcessingDocuments = async (req, res) => {
  try {
    const count = await documentService.countProcessingDocuments();
    res.status(200).json({ count });
  }
  catch (err) {
    console.error("Error counting processing documents:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// count of pending task documents where the doc_status is "todo"
export const countPendingTaskDocuments = async (req, res) => {
  try {
    const count = await documentService.countPendingTaskDocuments();
    res.status(200).json({ count });
  }
  catch (err) {
    console.error("Error counting pending task documents:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// count pending task documents assigned to a paralegal or staff
export const countUserPendingTaskDocuments = async (req, res) => {
  const userId = req.params.userId;
  try {
    const count = await documentService.countUserPendingTaskDocuments(userId);
    res.status(200).json({ count });
  }
  catch (err) {
    console.error("Error counting user pending task documents:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}




