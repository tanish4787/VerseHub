import express from "express";
import { protectedRoute } from "../Auth/Auth.Middlewares.js";
import {
  getUser,
  updateUserProfile,
  followUser,
  unfollowUser,
} from "./Users.Controllers.js";
const router = express.Router();

router.get("/:userId", getUser);
router.put("/profile", protectedRoute, updateUserProfile);
router.post("/:userId/follow", protectedRoute, followUser);
router.post("/:userId/unfollow", protectedRoute, unfollowUser);

export default router;
