import { Request, Response } from "express";
import fs from "fs";
import path from "path";

import { getDocument, PDFDocumentProxy } from "pdfjs-dist/legacy/build/pdf.js";

export const GetTextFromPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const filePath = path.resolve(req.file.path);
    const data = new Uint8Array(fs.readFileSync(filePath));
    const loadingTask = getDocument({ data });
    const doc: PDFDocumentProxy = await loadingTask.promise;

    let allText = "";

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item: any) => item.str).join(" ");
      allText += text + "\n";
    }

    fs.unlinkSync(filePath); // Clean up uploaded file

    res.json({ text: allText });
  } catch (error) {
    console.error("PDF parsing error:", error);
    res.status(500).json({ error: "Failed to parse PDF" });
  }
};
