import { User, Chat } from "../models/index.js";
import AppError from "../classes/AppError.js";
const createChat = async (recipientId, user) => {
  if (user._id.equals(recipientId)) {
    throw new AppError("Self chat is not allowed", 403);
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    throw new AppError("User not found", 404);
  }

  const existingChat = await Chat.findOne({
    participants: { $all: [recipientId, user._id] },
  });

  if (!existingChat) {
    const newChat = await Chat.create({
      participants: [recipientId, user._id],
    });
    return newChat;
  }
  return existingChat;
};

const getChats = async (userId, user) => {
  if (!user._id.equals(userId)) {
    throw new AppError("You cannot get other's chats", 403);
  }

  const chats = await Chat.find({
    participants: userId,
    lastMsg: { $exists: true },
  })
    .populate({
      path: "participants",
      select: "username profileImgUrl",
    })
    .populate({
      path: "lastMsg",
      select: "createdAt text",
    });

  chats.forEach((chat) => {
    chat.participants = chat.participants.filter(
      (participant) => !participant._id.equals(user._id)
    );
  });

  return chats;
};
export default { createChat, getChats };
