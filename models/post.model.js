import mongoose from 'mongoose';
// import mongooseUniqueValidator from "mongoose-unique-validator";

const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    tags: {
      type: [String],
      default: [],
    },
    likedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    commentedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    uploadedImgs: {
      type: [
        {
          type: String,
        },
      ],
    },
  },
  {
    timestamps: {
      createdAt: 'postedAt', // Use `created_at` to store the created date
    },
  },
);

// postSchema.plugin(mongooseUniqueValidator, {
//   message: " {PATH} must be unique.",
// });

export default mongoose.model('Post', postSchema);
