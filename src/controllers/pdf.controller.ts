import { Request, Response } from "express";
import fs from "fs";
import path from "path";
// @ts-ignore
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.js";
import pdfjsLib from "pdfjs-dist";

// Optional: Configure worker path (helps avoid warnings)
GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.js");

// export const GetTextFromPDF = async (req: Request, res: Response): Promise<void> => {
//     try {
//         console.log(req.file)
//         if (!req.file) {
//             res.status(400).json({ error: "No file uploaded" });
//             return;
//         }

//         const filePath = path.resolve(req.file.path);
//         const data = new Uint8Array(fs.readFileSync(filePath));

//         const loadingTask = getDocument({
//             data,
//             // Disable external font loading which causes the LiberationSans error
//             standardFontDataUrl: '', // Important for avoiding fetch error
//             cMapUrl: undefined,      // Disable character maps if not needed
//             cMapPacked: true
//         });

//         const doc = await loadingTask.promise;

//         let pages: string[] = [];

//         for (let i = 1; i <= doc.numPages; i++) {
//             const page = await doc.getPage(i);
//             const content = await page.getTextContent();
//             const text = content.items.map((item: any) => item.str).join(" ");
//             pages.push(text);
//         }

//         fs.unlinkSync(filePath); // Clean up uploaded file

//         res.json({ pages }); // Send array instead of combined string
//     } catch (error) {
//         console.error("PDF parsing error:", error);
//         res.status(500).json({ error: "Failed to parse PDF" });
//     }
// };

export const GetTextFromPDF = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        const filePath = path.resolve(req.file.path);
        const data = new Uint8Array(fs.readFileSync(filePath));

        const loadingTask = getDocument({
            data,
            standardFontDataUrl: '',
            cMapUrl: undefined,
            cMapPacked: true
        });

        const doc = await loadingTask.promise;
        let detailsArray: string[] = [];

        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            const textItems = content.items.map((item: any) => item.str);

            // Filter for lines containing "Pay Bill" or "Salary Payment" etc.
            const details = textItems.filter(str =>
                str.includes("Pay Bill") || str.includes("Salary Payment") || str.includes("Merchant Pay Utility")
            );

            detailsArray.push(...details);
        }

        fs.unlinkSync(filePath); // Clean up uploaded file
        res.json({ details: detailsArray });
    } catch (error) {
        console.error("PDF parsing error:", error);
        res.status(500).json({ error: "Failed to parse PDF" });
    }
};

export const GetTransactionsFromPDF = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: "No file uploaded" });
            return;
        }

        const filePath = path.resolve(req.file.path);
        const data = new Uint8Array(fs.readFileSync(filePath));

        const loadingTask = getDocument({ data });
        const doc = await loadingTask.promise;

        const transactions: {
            receiptNo: string;
            completionTime: string;
            paidIn: string;
            phone: string;
            name: string;
            reasonType: string;
            otherPartyInfo: string;
        }[] = [];

        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const content = await page.getTextContent();
            const lines = content.items.map((item: any) => item.str).join("\n");

            const regex = /([A-Z0-9]{10})\s+(\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2})[\s\S]*?Pay Bill from\s+(\d{6,}[*]{3}\d{3})\s*[-\s]*(\w+.*?)\s+Acc\.[\s\S]*?Completed\s+([\d\-]+\.\d{2})[\s\S]*?(Pay Utility|Salary Payment|Merchant Pay Utility)[\s\S]*?(\d{6,}[*]{3}\d{3}\s*-\s*\w+.*?)\s*/g;

            let match;
            while ((match = regex.exec(lines)) !== null) {
                const [, receiptNo, completionTime, phone, name, paidIn, reasonType, otherPartyInfo] = match;
                transactions.push({
                    receiptNo,
                    completionTime,
                    paidIn,
                    phone,
                    name: name.trim(),
                    reasonType: reasonType.trim(),
                    otherPartyInfo: otherPartyInfo.trim()
                });
            }
        }

        fs.unlinkSync(filePath);
        res.json({ transactions });
    } catch (error) {
        console.error("PDF parsing error:", error);
        res.status(500).json({ error: "Failed to parse PDF" });
    }
};


