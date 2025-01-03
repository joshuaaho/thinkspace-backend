import mongoose from "mongoose";
import "dotenv/config";
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  profileImgUrl: {
    type: String,
    default: process.env.DEFAULT_PROFILE_IMG,
  },

  followedBy: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.model("User", userSchema);
