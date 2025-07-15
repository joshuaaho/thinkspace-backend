import User from "@domain/entities/User";

import { injectable } from "inversify";
import { MongoBaseRepository } from "@infrastructure/repositories/mongodb/MongoBaseRepository";
import MongoUserMapper from "@infrastructure/mappers/MongoUserMapper";

import { None, Some } from "ts-results-es";
import db from "@infrastructure/repositories/mongodb/MongoClient";
import IUserRepository, {
  UserQueryOptions,
} from "@domain/repositories/IUserRepository";

@injectable()
class MongoUserRepository
  extends MongoBaseRepository<User>
  implements IUserRepository
{
  constructor() {
    super(db.collection("users"), new MongoUserMapper());
  }

  async findByUsername(username: string) {
    const user = await this.collectionInstance.findOne({ username });
    if (!user) {
      return None;
    }

    return Some(this.mapper.toDomain(user));
  }

  async findByRefreshToken(refreshToken: string) {
    const user = await this.collectionInstance.findOne({ refreshToken });
    if (!user) {
      return None;
    }
    return Some(this.mapper.toDomain(user));
  }

  async findByEmail(email: string) {
    const user = await this.collectionInstance.findOne({ email });
    if (!user) {
      return None;
    }
    return Some(this.mapper.toDomain(user));
  }

  async query({
    offset = 0,
    limit = 10,
    username,
  }: UserQueryOptions): Promise<User[]> {
    const users = await this.collectionInstance
      .find({
        ...(username ? { username: { $regex: username, $options: "i" } } : {}),
      })
      .skip(offset)
      .limit(limit)
      .toArray();

    return users.map((user) => this.mapper.toDomain(user));
  }
}

export default MongoUserRepository;
