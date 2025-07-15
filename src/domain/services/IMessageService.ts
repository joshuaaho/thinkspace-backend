interface IMessageService {
  sendMessage(params: {
    userId: string;
    message: string;
    type: "COMMENT_REPLY" | "POST_LIKE" | "NEW_FOLLOWER";
  }): Promise<void>;
}

export default IMessageService;
