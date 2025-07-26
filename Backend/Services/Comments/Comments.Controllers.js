import mongoose from "mongoose";
import Post from "../../Models/Post.Model.js";
import Comment from "../../Models/Comment.Model.js";
import Notification from "../../Models/Notification.Model.js";

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }

    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({ error: "Invalid Parent Comment ID" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = new Comment({
      post: postId,
      user: userId,
      userInfo: {
        _id: req.user._id,
        username: req.user.username,
        profilePicture: req.user.profilePicture,
      },
      content,
      parentId: parentId || null,
    });

    const savedComment = await newComment.save();

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
    console.error("Error adding comment: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCommentWithReplies = async (commentId) => {
  const replies = await Comment.find({ parentId: commentId });
  for (const reply of replies) {
    await deleteCommentWithReplies(reply._id);
  }
  await Comment.findByIdAndDelete(commentId);
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const currentUserId = req.user._id.toString();

    const post = await Post.findById(comment.post);
    const isCommentAuthor = currentUserId === comment.user.toString();
    const isPostAuthor = post && currentUserId === post.author.toString();

    if (!isCommentAuthor && !isPostAuthor) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this comment" });
    }

    await deleteCommentWithReplies(commentId);

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
