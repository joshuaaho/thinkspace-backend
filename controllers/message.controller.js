import messageService from '#services/message.service';

const sendMessage = async (req, res, next) => {
  try {
    const newMessage = await messageService.sendMessage(req.body.chatId, req.body.text, req.user);
    return res.status(200).json(newMessage);
  } catch (err) {
    next(err);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const messages = await messageService.getMessages(req.query.chatId, req.user);
    return res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};
export default { sendMessage, getMessages };
