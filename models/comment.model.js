import mongoose from "mongoose";

const Schema = mongoose.Schema;
const commentSchema = new Schema(
  {
    authorId: {
      type: Schema.ObjectId,
      ref: "User",
    },
    postId: {
      type: Schema.ObjectId,
      ref: "Post",
    },
    parentCommentId: {
      type: Schema.ObjectId,
      ref: "Comment",
      default: null,
    },
    content: { type: String },

    likedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "postedAt",
    },
  }
);

export default mongoose.model("Comment", commentSchema);
