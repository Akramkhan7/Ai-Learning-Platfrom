// pdfParser.js - Fixed ESM + CommonJS compatibility
import { createRequire } from "module";
import fs from "fs";
import path from "path";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

export const parsePDF = async (filePath) => {
  try {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File not found: ${absolutePath}`);
    }

    const dataBuffer = fs.readFileSync(absolutePath);
    const data = await pdf(dataBuffer);

    if (!data.text || data.text.trim().length === 0) {
      throw new Error("PDF appears to be empty or scanned (no extractable text)");
    }

    console.log(`✅ PDF parsed: ${data.numpages} pages, ${data.text.length} characters`);

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    };
  } catch (err) {
    console.error("❌ PDF parsing error:", err.message);
    throw err;
  }
};