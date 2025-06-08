import { Router } from "express";
import { Create, Delete, Get, Get_one, togglectivate, Trash, Update } from "../controllers/services.controller";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../../public/uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      cb(null, uuidv4() + '-' + file.originalname);
    },
  })

const upload = multer({ storage });
const router = Router();
router.get("/", Get);
router.post("/", upload.single('image'), Create);
router.put("/:id", Update);
router.put("/toggle-active/:id", togglectivate);
router.delete("/:id", Delete);
router.get("/:id", Get_one);


export default router;
