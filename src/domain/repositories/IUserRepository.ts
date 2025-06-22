import IRepository from "@domain/repositories/IRepository";
import User from "@domain/entities/User";
import { Option } from "ts-results-es";
import { BaseQueryOptions } from "@domain/repositories/types";

export type UserQueryOptions = BaseQueryOptions &
  Partial<{
    username: string;
  }>;

interface IUserRepository extends IRepository<User> {
  findByUsername(username: string): Promise<Option<User>>;
  findByRefreshToken(refreshToken: string): Promise<Option<User>>;
  findByEmail(email: string): Promise<Option<User>>;
  findById(id: string): Promise<Option<User>>;
  query(queryOptions: UserQueryOptions): Promise<User[]>;
}

export default IUserRepository;
