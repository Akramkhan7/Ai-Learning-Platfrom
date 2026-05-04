import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_KEY environment variables");
}

const supabase = createClient(supabaseUrl, supabaseKey);


// ✅ Paste this temporarily in superbase.js and run it once
export const uploadPDF = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = `doc-${Date.now()}.pdf`;

  const { data, error } = await supabase.storage
    .from("Akram Khan")  // ✅ changed from "documents" to "Akram Khan"
    .upload(fileName, fileBuffer, {
      contentType: "application/pdf",
    });

  if (error) throw new Error(`Supabase upload error: ${error.message}`);

  const { data: urlData } = supabase.storage
    .from("Akram Khan")  // ✅ here too
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};