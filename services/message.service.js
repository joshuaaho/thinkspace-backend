import Chat from '#models/chat.model';
import Message from '#models/message.model';
import Notification from '#models/notification.model';
import AppError from '#classes/AppError';
import { getReceiverSocketId } from '../index.js';
import { socketIOSingleton } from '#socket/socket-factory';
import { getUser } from '#utils/context';
const sendMessage = async (chatId, text) => {
  const user = getUser();
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new AppError('Chat not found', 404);
  }
  if (!chat.participants.includes(user._id)) {
    throw new AppError('You do not belong to this chat', 403);
  }
  const newMessage = await (
    await Message.create({
      senderId: user._id,
      chatId,
      text,
    })
  ).populate({
    path: 'senderId',
    select: '_id profileImgUrl',
  });
  chat.lastMsg = newMessage._id;
  await chat.save();

  const receiverUserId = chat.participants.find((id) => !id.equals(user._id));

  const receiverSocketId = getReceiverSocketId(receiverUserId);
  const notification = await (
    await Notification.create({
      from: user._id,
      to: receiverUserId,
      redirectPath: `/chats/${chatId}`,
      event: 'has messaged you',
      resourceId: chatId,
    })
  ).populate({
    path: 'from',
    select: 'profileImgUrl username',
  });

  if (receiverSocketId) {
    console.log(receiverSocketId)
    socketIOSingleton.to(receiverSocketId).emit(chatId, newMessage);
    socketIOSingleton.to(receiverSocketId).emit('notifications', notification);
  }

  return newMessage;
};

const getMessages = async (chatId) => {
  const user = getUser();
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new AppError('Chat not found', 404);
  }

  if (!chat.participants.includes(user._id)) {
    throw new AppError('You do not belong to this chat', 403);
  }

  const messages = await Message.find({ chatId }).populate({
    path: 'senderId',
    select: '_id profileImgUrl',
  });

  return messages;
};

export default { sendMessage, getMessages };
