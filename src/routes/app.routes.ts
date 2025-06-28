import { Router } from "express";
import { Create, Delete, Get, Get_one, Update, } from "../controllers/app.controller";
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
router.get("/",authenticateToken, Get);
// router.get("/apps/all", authenticateToken, Get);
// router.get("/app", Get_one);
router.post("/", authenticateToken, upload.single('logo'), Create);
router.route('/:id')
  .delete(authenticateToken, Delete)
  .get( Get_one)
  .put(authenticateToken, Update)
// Update

export default router;
