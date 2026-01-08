import express from "express";
import { protectedRoute } from "../Auth/Auth.Middlewares.js";
import { addComment, deleteComment, getCommentsByPost } from "./Comments.Controllers.js";
const router = express.Router();


router.get("/:postId/comments", getCommentsByPost);
router.post("/:postId/comments", protectedRoute, addComment);
router.delete("/comments/:commentId", protectedRoute, deleteComment);

export default router;
