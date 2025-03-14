import mongoose from 'mongoose';
const chatSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    lastMsg: {
      type: String,
      ref: 'Message',
    },
  },
  { timestamps: true },
);

export default mongoose.model('Chat', chatSchema);
