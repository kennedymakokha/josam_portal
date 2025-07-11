import { Router } from "express";
import { sendSms } from "../controllers/sms.controller";

const router = Router();

router.post("/", sendSms);






export default router;
