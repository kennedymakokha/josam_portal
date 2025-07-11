import { Router } from "express";
import { Get, GetSmsbalance, sendSms } from "../controllers/sms.controller";

const router = Router();

router.post("/", sendSms);
router.post("/balance", GetSmsbalance);
router.get("/", Get);




export default router;
