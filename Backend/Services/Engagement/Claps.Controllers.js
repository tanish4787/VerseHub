import mongoose from "mongoose";
import Post from "../../Models/Post.Model.js";
import Clap from "../../Models/Clap.Model.js";

export const addClap = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(404).json({ message: "Invalid Post Id" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not Found" });
    }

    const existingClap = await Clap.findOne({ post: postId, user: userId });
    if (existingClap) {
      return res.status(409).json({ message: "Already Clapped." });
    }

    await Clap.create({ post: postId, user: userId });

    await Post.findByIdAndUpdate(postId, { $inc: { clapsCount: 1 } });

    return res.status(201).json({ message: "Clapped Successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export const removeClap = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(409).json({ message: "Invalid Post Id" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not Found" });
    }

    const deletedClap = await Clap.findOneAndDelete({
      post: postId,
      user: userId,
    });

    if (!deletedClap) {
      return res.status(404).json({ message: "You haven't clapped this post" });
    }

    await Post.findByIdAndUpdate(postId, { $inc: { clapsCount: -1 } });
    return res.status(201).json({ message: "Removed Clap Successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export const getPostClaps = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    const totalClaps = await Clap.countDocuments({ post: postId });

    let hasClapped = false;

    if (userId) {
      const userClap = await Clap.findOne({ post: postId, user: userId });
      hasClapped = !!userClap;
    }

    return res.status(200).json({ total: totalClaps, hasClapped });
  } catch (error) {
    console.error("Error in getPostClaps:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
