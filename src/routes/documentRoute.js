import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import * as documentController from "../controllers/documentController.js";
import verifyUser from "../middleware/verifyUser.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const docType = req.body.doc_type;
    let uploadPath = "D:/Capstone_ni_Angelie/uploads";

    if (docType === "Task") {
      uploadPath += "/taskedDocs";
    } else if (docType === "Supporting") {
      uploadPath += "/supportingDocs";
    } else if (file.fieldname === "doc_reference") {
      uploadPath += "/referenceDocs";
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF and Word files are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

const uploadFields = upload.fields([
  { name: "doc_file", maxCount: 1 },
  { name: "doc_reference", maxCount: 10 },
]);

router.get("/documents", documentController.getDocuments);
router.get("/documents/:id", verifyUser, documentController.getDocumentById);
router.get(
  "/case/documents/:caseId",
  verifyUser,
  documentController.getDocumentsByCaseId
);

router.post(
  "/documents",
  verifyUser,
  uploadFields,
  documentController.createDocument
);

export default router;
