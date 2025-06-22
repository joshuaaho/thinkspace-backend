import { injectable } from "inversify";
import { io, userSocketMap } from "@infrastructure/socket";
import IMessageService, {
  SendMessageDto,
} from "@application/services/IMessageService";

import "dotenv/config";

@injectable()
class SocketIOMessageService implements IMessageService {
  constructor() {}

  sendMessage(message: SendMessageDto, receiverId: string): void {
    io.to(userSocketMap[receiverId]).emit("newChatMessage", message);
  }
}
export default SocketIOMessageService;
