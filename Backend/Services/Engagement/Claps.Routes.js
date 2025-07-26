import express from "express";
import { protectedRoute } from "../Auth/Auth.Middlewares.js";
import { addClap, removeClap, getPostClaps } from "./Claps.Controllers.js";
const router = express.Router();

router.post("/:postId/clap", protectedRoute, addClap);
router.delete("/:postId/clap", protectedRoute, removeClap);
router.get("/:postId/claps", getPostClaps);

export default router;

