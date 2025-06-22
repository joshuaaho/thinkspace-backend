

export type SendMessageDto = {
  id: string;
  username: string;
  profileImgUrl: string;
  content: string;
  createdAt: string;
  otherParticipantId: string;
  isFromCurrentUser: boolean;
};

 interface IMessageService {
  sendMessage(message: SendMessageDto,receiverId: string): void;

}

export default IMessageService;
