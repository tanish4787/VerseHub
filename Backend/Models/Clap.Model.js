import mongoose from "mongoose";

const ClapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

ClapSchema.index(
  { user: 1, post: 1 },
  { unique: true, name: "unique_user_post_clap" }
);

ClapSchema.index({ post: 1 });

const Clap = mongoose.model("Clap", ClapSchema);
export default Clap;
