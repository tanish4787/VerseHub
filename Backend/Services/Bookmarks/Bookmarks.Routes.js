import express from "express";
import { protectedRoute } from "../Auth/Auth.Middlewares.js";
import {
  getBookmarks,
  toggleBookmark,
} from "./Bookmarks.Controllers.js";
const router = express.Router();

router
  .get("/", protectedRoute, getBookmarks)
  .post("/:postId", protectedRoute, toggleBookmark)
  .delete("/:postId", protectedRoute, toggleBookmark);

export default router;
