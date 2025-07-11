import { Router } from "express";
import { Get, sendSms } from "../controllers/sms.controller";

const router = Router();

router.post("/", sendSms);

router.get("/", Get);




export default router;
