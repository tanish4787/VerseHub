import mongoose from "mongoose";
import Post from "../../Models/Post.Model.js";
import Comment from "../../Models/Comment.Model.js";
import Notification from "../../Models/Notification.Model.js";

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};





export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Comment content is required" });
    }

    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ error: "Invalid Parent Comment ID" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment || String(parentComment.post) !== String(postId)) {
        return res.status(400).json({ error: "Invalid parent comment" });
      }
    }

    const newComment = new Comment({
      post: postId,
      user: userId,
      userInfo: {
        _id: req.user._id,
        username: req.user.username,
        profilePicture: req.user.profilePicture,
      },
      content: content.trim(),
      parentId: parentId || null,
    });

    const savedComment = await newComment.save();

    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

    if (String(post.author) !== String(userId)) {
      await Notification.create({
        recipient: post.author,
        sourceUser: userId,
        sourcePost: postId,
        type: "new_comment",
        message: `${req.user.username} commented on your post.`,
      });
    }

    return res.status(201).json({
      message: "Comment added successfully",
      comment: savedComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCommentWithReplies = async (commentId, session) => {
  const replies = await Comment.find({ parentId: commentId }).session(session);
  for (const reply of replies) {
    await deleteCommentWithReplies(reply._id, session);
  }
  await Comment.findByIdAndDelete(commentId).session(session);
};

export const deleteComment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId).session(session);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const post = await Post.findById(comment.post).session(session);

    const currentUserId = req.user._id.toString();
    const isCommentAuthor = currentUserId === comment.user.toString();
    const isPostAuthor = post && currentUserId === post.author.toString();

    if (!isCommentAuthor && !isPostAuthor) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this comment" });
    }

    await deleteCommentWithReplies(commentId, session);

    await Post.findByIdAndUpdate(
      comment.post,
      { $inc: { commentsCount: -1 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting comment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
