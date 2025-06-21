import { Router } from "express";
import { Create, Delete, Get, Get_one, post_comment, toggle_like, Update } from "../controllers/posts.controller";
import { authenticateToken } from "../middleware/auth.middleware";
const router = Router();
router.route('/')
  .get(authenticateToken, Get)
  .post(authenticateToken, Create)
router.route('/:id')
  .delete(authenticateToken, Delete)
  .get(authenticateToken, Get_one)
  .put(authenticateToken, Update)
router.route('/:id/comments')
  .post(authenticateToken, post_comment)
router.route('/:id/likes')
  .post(authenticateToken, toggle_like)
export default router;
