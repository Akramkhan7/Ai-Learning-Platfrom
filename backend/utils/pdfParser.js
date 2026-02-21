import fs from 'fs/promises';
import {PDFParse} from "pdf-parse";
import { text } from 'stream/consumers';

export const extractTextFromPDF  = async(req, res, next) =>{
    try {
        const dataBuffer = await fs.readFile(filePath);
        const parser = new PDFParse(new Uint8Array(dataBuffer));
        const data = await parser.getText();

        return {
            text : data.text,
            numPages : data.numPages,
            info : data.info,
        };
    } catch(err){
        console.log("Pdf Parser. error :" + err);

        throw new Error("failed to extract text from PDF");
    }
}
