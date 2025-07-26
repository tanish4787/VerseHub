import express from "express";
import { protectedRoute } from "../Auth/Auth.Middlewares.js";
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  deleteNotification,
  clearAllNotifications,
} from "./Notifications.Contollers.js";
const router = express.Router();

router
  .get("/", protectedRoute, getNotifications)
  .get("/unread-count", protectedRoute, getUnreadCount)
  .put("/:id/read", protectedRoute, markNotificationRead)
  .put("/read-all", protectedRoute, markAllNotificationsRead)
  .delete("/:id", protectedRoute, deleteNotification)
  .delete("/clear", protectedRoute, clearAllNotifications);

export default router;
