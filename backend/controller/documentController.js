import Document from "../models/Document.js";
import FlashCard from "../models/FlashCard.js";
import Quiz from "../models/Quiz.js";
import mongoose from "mongoose";
import fs from "fs/promises";
import { chunkText } from "../utils/textChunker.js";
import { uploadPDF } from "../config/superbase.js";
import { parsePdf } from "../utils/pdfParser.js"
import path from "path";


import axios from "axios";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse"); // ✅ correct way for ESM + pdf-parse

const processPDF = async (documentId, fileUrl) => {
  try {
    console.log("Downloading:", fileUrl);

    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
    });

   

    const buffer = Buffer.from(response.data);

    const data = await parsePdf(buffer); // ✅ pass buffer directly
    const text = JSON.stringify(data, null, 2);



    if (!text || text.trim().length === 0) {
      throw new Error("Empty PDF content");
    }

    const chunks = chunkText(text, 500, 50);

    await Document.findByIdAndUpdate(documentId, {
      content: text,
      chunks,
      status: "ready",
    });

    console.log(`✅ Document ${documentId} processed successfully`);

  } catch (err) {
    console.error(`Processing error for ${documentId}:`, err.message);
    await Document.findByIdAndUpdate(documentId, { status: "failed" });
  }
};
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }
    console.log(req.file);

    const { title } = req.body;

    if (!title) {
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Please provide a title",
      });
    }

    const result = await uploadPDF(req.file.path);

    if (!result) {
      return res.status(500).json({
        success: false,
        message: "Unable to upload on cloudinary",
      });
    }
    console.log(result);

    const document = await Document.create({
      userId: req.user._id,
      title,
      fileName: req.file.originalname,
      filePath: result, // public URL
      localPath: req.file.path, // local file path for deletion
      fileSize: req.file.size,
      status: "processing",
    });
    console.log(document);

    // Run processing in background (non-blocking)
    processPDF(document._id, document.filePath).catch(console.error);

    return res.status(201).json({
      success: true,
      message: "PDF uploaded successfully. Processing started.",
    });
  } catch (err) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    next(err);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    console.log("REQ.USER:", req.user);
    const documents = await Document.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $lookup: {
          from: "flashcards",
          localField: "_id",
          foreignField: "documentId",
          as: "flashcardSets",
        },
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "_id",
          foreignField: "documentId",
          as: "quizzes",
        },
      },
      {
        $addFields: {
          flashcardCount: { $size: "$flashcardSets" },
          quizCount: { $size: "$quizzes" },
        },
      },
      {
        $project: {
          extractedText: 0,
          chunks: 0,
          flashcardSets: 0,
          quizzes: 0,
        },
      },
      {
        $sort: {
          uploadDate: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      count: documents.length,
      data: documents,
    });
  } catch (err) {
    next(err);
  }
};

export const getDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const flashcardCount = await FlashCard.countDocuments({
      documentId: document._id,
      userId: req.user._id,
    });

    const quizCount = await Quiz.countDocuments({
      documentId: document._id,
      userId: req.user._id,
    });

    document.lastAccessed = Date.now();
    await document.save();

    const documentData = document.toObject();
    documentData.flashcardCount = flashcardCount;
    documentData.quizCount = quizCount;

    return res.status(200).json({
      success: true,
      data: documentData,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Delete local file safely
    if (document.localPath) {
      await fs.unlink(document.localPath).catch(() => {});
    }

    await document.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
