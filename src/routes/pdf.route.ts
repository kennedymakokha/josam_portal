import { Router } from "express";
import { Create, Delete, Get, Get_one, Update, } from "../controllers/app.controller";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { authenticateToken } from "../middleware/auth.middleware";
import { GetTextFromPDF, GetTransactionsFromPDF } from "../controllers/pdf.controller";

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });
const router = Router();

router.post("/", upload.single('pdf'), GetTransactionsFromPDF);


export default router;
