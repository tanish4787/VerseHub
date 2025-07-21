import express from "express";
import { protectedRoute } from "../Auth/Auth.Middlewares.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
  getPostsByTag,
  getPostsByUser,
} from "./Posts.Controllers.js";

const router = express.Router();

router
  .get("/", getAllPosts)
  .post("/", protectedRoute, createPost)

  .get("/user/:userId", getPostsByUser)
  .get("/tag/:tag", getPostsByTag)

  .get("/:postId", getPostById)
  .put("/:postId", protectedRoute, updatePost)
  .delete("/:postId", protectedRoute, deletePost);

export default router;
