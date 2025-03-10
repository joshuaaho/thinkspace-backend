import chatService from '#services/chat.service';

const createChat = async (req, res, next) => {
  try {
    const chat = await chatService.createChat(req.body.recipientId);
    return res.status(200).json(chat);
  } catch (err) {
    next(err);
  }
};

const getChats = async (req, res, next) => {
  try {
    const chats = await chatService.getChats(req.query.userId);
    return res.status(200).json(chats);
  } catch (err) {
    next(err);
  }
};

export default {
  createChat,
  getChats,
};
