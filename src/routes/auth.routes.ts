import { Router } from "express";
import { register, login, logout, refresh, session_Check, updatePassword, updateKey } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();
router.post("/register", register);
router.post("/update_key", authenticateToken, updateKey);
router.post("/login", login);

router.get("/",authenticateToken, session_Check);
// router.get("/users", getUsers);
router.post("/refresh", refresh);
router.post("/reset-password", updatePassword);

// router.post("/activate-user", activateuser);
// router.post("/verify-otp", verifyuser);
// router.post("/request-otp", requestToken);
router.post("/logout",authenticateToken, logout);



export default router;
