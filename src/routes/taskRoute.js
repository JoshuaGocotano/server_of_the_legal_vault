import express from 'express';
import multer from 'multer';
import path from 'path';
import * as taskController from '../controllers/taskController.js';
import verifyUser from '../middleware/verifyUser.js';
import requireAdmin from '../middleware/requireAdmin.js';

const router = express.Router();

// Multer setup for documents uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "C:/Users/Khling/caps/uploads");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.round() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["application/pdf",];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error("Only PDF files are allowed"));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

//Routes 
router.get('/tasks', verifyUser, requireAdmin, taskController.getTask);

router.post(
    '/tasks', 
    verifyUser,
    upload.single('td_doc_path'),
    taskController.createTask
);

export default router;