import { injectable } from "inversify";
import { MongoBaseRepository } from "./MongoBaseRepository";

import MongoMessageMapper from "@infrastructure/mappers/MongoMessageMapper";
import Message from "@domain/entities/Message";

import db from "@infrastructure/repositories/mongodb/MongoClient";
import IMessageRepository, { MessageQueryOptions } from "@domain/repositories/IMessageRepository";
@injectable()
class MongoMessageRepository
  extends MongoBaseRepository<Message>
  implements IMessageRepository
{
  constructor() {
    super(db.collection("messages"), new MongoMessageMapper());
  }

  async query({
    participantIds,
    offset = 0,
    limit = 10,
  }: MessageQueryOptions): Promise<Message[]> {
    const [participantA, participantB] = participantIds;

    const dalEntities = await this.collectionInstance
      .find({
        $or: [
          { senderId: participantA, receiverId: participantB },
          { senderId: participantB, receiverId: participantA },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    return dalEntities.map((entity) => this.mapper.toDomain(entity));
  }

  async getChatList(userId: string): Promise<Message[]> {
    const dalEntities = await this.collectionInstance
      .aggregate([
        {
          $match: {
            $or: [{ senderId: userId }, { receiverId: userId }],
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$senderId", userId] },
                "$receiverId",
                "$senderId",
              ],
            },
            latestMessage: { $first: "$$ROOT" },
          },
        },
        {
          $replaceRoot: { newRoot: "$latestMessage" },
        },
      ])
      .toArray();

    return dalEntities.map((entity) => this.mapper.toDomain(entity));
  }
}

export default MongoMessageRepository;
