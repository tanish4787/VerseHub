import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    authorInfo: {
      _id: mongoose.Schema.Types.ObjectId,
      username: { type: String },
      profilePicture: { type: String },
    },

    title: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: String,
    },
    tags: {
      type: [String],
      index: true,
    },
    readingTime: {
      type: String,
    },
    clapsCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    isDraft: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post
