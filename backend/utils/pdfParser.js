import fs from "fs";
import PDFParser from "pdf2json";

// 🔹 Function to extract PDF → JSON
export async function parsePdf(buffer) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataReady", (data) => {
      resolve(data);
    });

    pdfParser.on("pdfParser_dataError", (err) => {
      reject(err);
    });

    pdfParser.parseBuffer(buffer);
  });
}

