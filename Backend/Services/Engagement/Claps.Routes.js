import express from "express";
import { protectedRoute } from "../Auth/Auth.Middlewares.js";
import {
  toggleClap,
  
  getPostClaps,
} from "./Claps.Controllers.js";
const router = express.Router();

router.post("/:postId/clap", protectedRoute, toggleClap);
router.get("/:postId/claps", getPostClaps);

export default router;
