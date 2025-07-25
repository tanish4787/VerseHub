import mongoose from "mongoose";
import User from "../../Models/User.Model.js";

export const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = mongoose.Types.ObjectId.isValid(userId)
      ? await User.findById(userId).select(
          "_id username email bio profilePicture followers following createdAt"
        )
      : null;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const response = {
      _id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      followers: user.followers.length,
      following: user.following.length,
      createdAt: user.createdAt,
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const updateUserProfile = async (req, res) => {
  try {
    const { _id } = req.user;
    const { username, email, bio, profilePicture } = req.body;

    const user = await User.findById(_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;

    const updated = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updated._id,
        username: updated.username,
        email: updated.email,
        bio: updated.bio,
        profilePicture: updated.profilePicture,
        createdAt: updated.createdAt,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const followUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: "Prohibited" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (currentUser.following.includes(targetUserId)) {
      return res
        .status(400)
        .json({ error: "You are already following this user." });
    }
    currentUser.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      message: "Successfully followed the user",
      followingCount: currentUser.following.length,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: "Prohibited." });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }
    if (!currentUser.following.includes(targetUserId)) {
      return res
        .status(400)
        .json({ error: "You are not following this user." });
    }

    currentUser.following.pull(targetUserId);
    targetUser.followers.pull(currentUserId);

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      message: "Successfully unfollowed the user",
      followingCount: currentUser.following.length,
      followersCount: targetUser.followers.length,
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
