import express from "express";

import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
} from "../controller/documentController.js";

import protect from "../middleware/auth.js";
import upload from "../config/multer.js";

const router = express.Router();

router.use(protect);

// Upload
router.post("/upload", upload.single("file"), uploadDocument);

// Get all documents
router.get("/", getDocuments);

// Get single document
router.get("/:id", getDocument);

// Delete document
router.delete("/:id", deleteDocument);

export default router;