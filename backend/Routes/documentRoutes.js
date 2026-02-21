import express, { Router } from "express";

import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  updateDocument,
} from "../controller/documentController.js";
import protect from "../middleware/auth.js";
import  upload  from "../config/multer.js";

const router = express.Router();
router.use(protect);

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/documents", getDocuments);
router.get("/:id", getDocument);
router.get("/:id", updateDocument);
router.get("/:id", deleteDocument);

export default router;
