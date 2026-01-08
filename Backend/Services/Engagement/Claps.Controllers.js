import mongoose from "mongoose";
import Post from "../../Models/Post.Model.js";
import Clap from "../../Models/Clap.Model.js";
import Notification from "../../Models/Notification.Model.js";

export const toggleClap = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { postId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: "Invalid Post ID" });
    }

    const post = await Post.findById(postId).session(session);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const existingClap = await Clap.findOne({
      post: postId,
      user: userId,
    }).session(session);

    let hasClapped;
    let clapsDelta;

    if (existingClap) {
      await existingClap.deleteOne({ session });
      clapsDelta = -1;
      hasClapped = false;
    } else {
      await Clap.create([{ post: postId, user: userId }], { session });
      clapsDelta = 1;
      hasClapped = true;

      if (String(post.author) !== String(userId)) {
        await Notification.create(
          [
            {
              recipient: post.author,
              sourceUser: userId,
              sourcePost: postId,
              type: "new_clap",
              message: `${req.user.name} clapped your post.`,
            },
          ],
          { session }
        );
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { clapsCount: clapsDelta } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      hasClapped,
      clapsCount: updatedPost.clapsCount,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error toggling clap:", error);
    return res.status(500).json({ message: "Internal Server Error" });
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
