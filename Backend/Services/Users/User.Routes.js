import express from "express";
import { protectedRoute } from "../Auth/Auth.Middlewares.js";
import {
  getUser,
  updateUserProfile,
  toggleFollow,
} from "./Users.Controllers.js";
const router = express.Router();

router.get("/:userId", getUser);
router.put("/profile", protectedRoute, updateUserProfile);
router.post("/:userId/follow", protectedRoute, toggleFollow);
router.post("/:userId/unfollow", protectedRoute, toggleFollow);

export default router;
