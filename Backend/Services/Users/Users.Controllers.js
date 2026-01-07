import mongoose from "mongoose";
import User from "../../Models/User.Model.js";
import Notification from "../../Models/Notification.Model.js";

export const getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const user = await User.findById(userId).select(
      "_id username bio profilePicture followers following createdAt"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      _id: user._id,
      username: user.username,
      bio: user.bio,
      profilePicture: user.profilePicture,
      followers: user.followers.length,
      following: user.following.length,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
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

    return res.status(200).json({
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
    return res.status(500).json({ error: "Server error" });
  }
};

export const toggleFollow = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const currentUserId = req.user._id;
    const targetUserId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    if (String(currentUserId) === String(targetUserId)) {
      return res.status(400).json({ error: "Prohibited" });
    }

    const currentUser = await User.findById(currentUserId).session(session);
    const targetUser = await User.findById(targetUserId).session(session);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.some(
      (id) => String(id) === String(targetUserId)
    );

    let following;

    if (isFollowing) {
      await User.findByIdAndUpdate(
        currentUserId,
        { $pull: { following: targetUserId } },
        { session }
      );
      await User.findByIdAndUpdate(
        targetUserId,
        { $pull: { followers: currentUserId } },
        { session }
      );
      following = false;
    } else {
      await User.findByIdAndUpdate(
        currentUserId,
        { $addToSet: { following: targetUserId } },
        { session }
      );
      await User.findByIdAndUpdate(
        targetUserId,
        { $addToSet: { followers: currentUserId } },
        { session }
      );
      following = true;

      await Notification.create(
        [
          {
            recipient: targetUserId,
            sourceUser: currentUserId,
            type: "new_follower",
            message: `${currentUser.username} started following you.`,
          },
        ],
        { session }
      );
    }

    const updatedCurrentUser = await User.findById(currentUserId).session(
      session
    );
    const updatedTargetUser = await User.findById(targetUserId).session(
      session
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      following,
      followingCount: updatedCurrentUser.following.length,
      followersCount: updatedTargetUser.followers.length,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error toggling follow:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
