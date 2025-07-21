import mongoose from "mongoose";
import User from "../../Models/User.Model.js";
import Post from "../../Models/Post.Model.js";
import readingTime from "reading-time";

export const createPost = async (req, res) => {
  try {
    const { title, content, featuredImage, tags, isDraft, status } = req.body;
    const author = req.user._id;

    if (!title || !content || !author) {
      return res
        .status(400)
        .json({ message: "Title, content, and author are required." });
    }

    const newPost = await Post.create({
      title,
      content,
      featuredImage,
      tags,
      isDraft,
      status: status || "published",
      readingTime: readingTime(content).text,
      author,
      authorInfo: {
        _id: req.user._id,
        username: req.user.username,
        profilePicture: req.user.profilePicture,
      },
    });

    return res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Failed to create post." });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const { tag, search } = req.query;

    let query = { status: "published" };

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { content: new RegExp(search, "i") },
      ];
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .select("-content");

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Get all posts error:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.isDraft) {
      if (!req.user || String(req.user._id) !== String(post.author)) {
        return res.status(403).json({ error: "Access denied to draft post" });
      }
    }

    res.status(200).json({ post });
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (String(post.author) !== String(req.user._id)) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const updatableFields = [
      "title",
      "content",
      "tags",
      "featuredImage",
      "isDraft",
      "status",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        post[field] = req.body[field];
      }
    });

    const updatedPost = await post.save();

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid Post ID" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (String(post.author) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this post" });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const posts = await Post.find({
      author: userId,
      status: "published",
    }).sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts by user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPostsByTag = async (req, res) => {
  try {
    const { tag } = req.params;

    if (!tag) {
      return res.status(400).json({ error: "Tag is required" });
    }

    const posts = await Post.find({
      tags: { $in: [tag] },
      status: "published",
    }).sort({ createdAt: -1 });

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts by tag:", error);
    res.status(500).json({ error: "Server error" });
  }
};
