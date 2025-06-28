import { Router } from "express";
import { Create, Delete, Get, Get_one, Get_one_by_category, GetBykey, togglectivate, Trash, Update } from "../controllers/services.controller";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { authenticateToken } from "../middleware/auth.middleware";

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // Get file extension
    const base = path.basename(file.originalname, ext); // Remove extension
    const sanitizedBase = base.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\-]/g, ''); // Remove special characters
    cb(null, `${uuidv4()}-${sanitizedBase}${ext}`);
  }
})

const upload = multer({ storage });
const router = Router();
router.get("/", authenticateToken, Get);
router.get("/:app/:category", Get_one_by_category);
router.post("/", authenticateToken, upload.single('image'), Create);
router.put("/:id", authenticateToken, Update);
router.put("/toggle-active/:id", authenticateToken, togglectivate);
router.delete("/:id", authenticateToken, Delete);
router.get("/:id", authenticateToken, Get_one);
router.get("/forms/all", GetBykey);


export default router;
