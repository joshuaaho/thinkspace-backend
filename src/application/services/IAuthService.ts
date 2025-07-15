import { UnauthenticatedError } from "@application/useCases/errors";
import { Result } from "ts-results-es";

export type AccessToken = string;
export type RefreshToken = string;
export type JwtPayload = {
  userId: string;
  exp: number;
};
interface IJwtService {
  createAccessToken(userId: string): AccessToken;

  createRefreshToken(userId: string): RefreshToken;
  verifyAccessToken(
    token: AccessToken,
  ): Result<JwtPayload, UnauthenticatedError>;
  verifyRefreshToken(
    token: RefreshToken,
  ): Result<JwtPayload, UnauthenticatedError>;
}

export default IJwtService;
