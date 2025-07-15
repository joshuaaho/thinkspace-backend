import { Request } from "express";
import IAuthService from "@application/services/IAuthService";
import CONSTANTS from "@containers/constants";
import IUserRepository from "@domain/repositories/IUserRepository";
import User from "@domain/entities/User";
import { iocContainer } from "@containers/index";
import { UnauthenticatedError } from "@application/useCases/errors";
export interface AuthenticatedRequest extends Request {
  user: User;
}

const authService = iocContainer.get<IAuthService>(CONSTANTS.AuthService);
const userRepo = iocContainer.get<IUserRepository>(CONSTANTS.UserRepository);

export async function expressAuthentication(
  request: Request,
  _securityName: string,
  _scopes?: string[],
): Promise<any> {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Promise.reject(new UnauthenticatedError("Access token is required"));
  }

  const token = authHeader.split(" ")[1];

  const payload = authService.verifyAccessToken(token);

  if (payload.isErr()) {
    return Promise.reject(payload.error);
  }

  const user = await userRepo.findById(payload.value.userId);
  if (user.isNone()) {
    return Promise.reject(new UnauthenticatedError("User not found"));
  }
  return Promise.resolve(user.value);
}
