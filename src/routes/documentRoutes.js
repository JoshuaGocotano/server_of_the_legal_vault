import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import * as documentController from "../controllers/documentController.js";
import verifyUser from "../middleware/verifyUser.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/documents", documentController.getDocuments);

export default router;