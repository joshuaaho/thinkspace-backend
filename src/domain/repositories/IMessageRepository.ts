import Message from "@domain/entities/Message";
import IRepository from "@domain/repositories/IRepository";
import { BaseQueryOptions } from "@domain/repositories/types";

export type MessageQueryOptions = BaseQueryOptions & {
  participantIds: string[];
};

interface IMessageRepository extends IRepository<Message> {
  query(queryOptions: MessageQueryOptions): Promise<Message[]>;
  getChatList(userId: string): Promise<Message[]>;
}

export default IMessageRepository;
