import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logoutUser,
} from "./Auth.Conrollers.js";
import { protectedRoute } from "./Auth.Middlewares.js";
const router = express.Router();

router
  .post("/register", registerUser)
  .post("/login", loginUser)
  .post("/forgot-password", forgotPassword)
  .put("/reset/:token", resetPassword)
  .post("/verify/:token", verifyEmail)
  .post("/logout", protectedRoute, logoutUser);

export default router;
