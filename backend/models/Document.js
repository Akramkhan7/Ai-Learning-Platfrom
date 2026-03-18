import mongoose, { Schema } from "mongoose";

const DocumentSchema = new Schema(
  {
    userId: {                          // ← was "documentId"
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a valid Title"],
      trim: true,
    },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    localPath: { type: String, default: "" }, // ← was missing
    fileSize: { type: Number, required: true },
    extractedText: { type: String, default: "" },  // ← was required:true
    description: { type: String, default: "" },    // ← was required:true
    chunks: [
      {
        content: { type: String, required: true },
        pageNumber: { type: Number, default: 0 },
        chunkIndex: { type: Number, required: true },
      },
    ],
    uploadDate: { type: Date, default: Date.now },
    lastAccessed: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
    },
  },
  { timestamps: true }
);

DocumentSchema.index({ userId: 1, uploadDate: -1 });
const Document = mongoose.model("Document", DocumentSchema);

export default Document;
