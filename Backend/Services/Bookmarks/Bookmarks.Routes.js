import express from "express";
import { protectedRoute } from "../Auth/Auth.Middlewares.js";
import {
  getBookmarks,
  removeBookmark,
  saveBookmark,
} from "./Bookmarks.Controllers.js";
const router = express.Router();

router
  .get("/", protectedRoute, getBookmarks)
  .post("/:postId", protectedRoute, saveBookmark)
  .delete("/:postId", protectedRoute, removeBookmark);

export default router;
