import mongoose from "mongoose";
import User from "../../Models/User.Model.js";
import Post from "../../Models/Post.Model.js";

export const toggleBookmark = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const user = await User.findById(userId);

    const alreadyBookmarked = user.bookmarks.some(
      (id) => String(id) === String(postId)
    );

    let isBookmarked;

    if (alreadyBookmarked) {
      await User.findByIdAndUpdate(userId, {
        $pull: { bookmarks: postId },
      });
      isBookmarked = false;
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { bookmarks: postId },
      });
      isBookmarked = true;
    }

    return res.status(200).json({ isBookmarked });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)
      .populate({
        path: "bookmarks",
        select:
          "_id title authorInfo tags readingTime clapsCount commentsCount isDraft createdAt",
      })
      .lean();

    return res.status(200).json({ bookmarks: user.bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
