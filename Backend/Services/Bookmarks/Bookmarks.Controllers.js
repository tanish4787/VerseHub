import mongoose from "mongoose";
import User from "../../Models/User.Model.js";
import Post from "../../Models/Post.Model.js";

export const saveBookmark = async (req, res) => {
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

    if (user.bookmarks.includes(postId)) {
      return res.status(400).json({ message: "Post already bookmarked." });
    }

    user.bookmarks.push(postId);
    await user.save();

    return res.status(200).json({ message: "Post bookmarked successfully." });


  } catch (error) {
    console.error("Error bookmarking post:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




export const removeBookmark = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    const user = await User.findById(userId);

    if (!user.bookmarks.includes(postId)) {
      return res.status(404).json({ message: "Bookmark not found." });
    }

    user.bookmarks = user.bookmarks.filter(
      (bookmarkId) => String(bookmarkId) !== String(postId)
    );
    await user.save();

    return res.status(200).json({ message: "Bookmark removed successfully." });

  } catch (error) {
    console.error("Error removing bookmark:", error);
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
          "_id title content authorInfo tags readingTime clapsCount commentsCount isDraft createdAt",
      })
      .lean();

    return res.status(200).json({ bookmarks: user.bookmarks });

  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
    