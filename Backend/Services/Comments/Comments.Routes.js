import express from "express";
import { protectedRoute } from "../Auth/Auth.Middlewares.js";
import { addComment, deleteComment } from "./Comments.Controllers.js";
const router = express.Router();

router.post("/:postId/comments", protectedRoute, addComment);
router.delete("/comments/:commentId", protectedRoute, deleteComment);

export default router;
