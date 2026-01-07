import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./Configs/db.js";
import authRoutes from "./Services/Auth/Auth.Routes.js";
import postRoutes from "./Services/Posts/Posts.Routes.js";
import userRoutes from "./Services/Users/User.Routes.js";
import clapRoutes from "./Services/Engagement/Claps.Routes.js";
import commentRoutes from "./Services/Comments/Comments.Routes.js";
import bookmarkRoutes from "./Services/Bookmarks/Bookmarks.Routes.js";
import notificationRoutes from "./Services/Notifications/Notifications.Routes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/claps", clapRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((err, req, res, next) => {
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
