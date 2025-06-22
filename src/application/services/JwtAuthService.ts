import { injectable } from "inversify";
import {
  AccessToken,
  RefreshToken,
  JwtPayload,
} from "@application/services/IAuthService";
import IJwtService from "@application/services/IAuthService";
import "dotenv/config";
import { StringValue } from "ms";
import jwt from "jsonwebtoken";
import { UnauthenticatedError } from "@application/useCases/errors";
import { Err, Ok, Result } from "ts-results-es";

@injectable()
class JwtService implements IJwtService {
  constructor() {}

  createAccessToken(userId: string): AccessToken {
    const token = jwt.sign(
      { userId },
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION as StringValue,
      }
    );

    return token;
  }

  createRefreshToken(userId: string): RefreshToken {
    const refreshToken = jwt.sign(
      { userId },
      process.env.JWT_REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION as StringValue,
      }
    );

    return refreshToken;
  }
  verifyAccessToken(
    token: AccessToken
  ): Result<JwtPayload, UnauthenticatedError> {
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN_SECRET as string
      ) as JwtPayload;
      return Ok(payload);
    } catch (error) {
      return Err(new UnauthenticatedError("Invalid access token"));
    }
  }

  verifyRefreshToken(
    token: RefreshToken
  ): Result<JwtPayload, UnauthenticatedError> {
    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_REFRESH_TOKEN_SECRET as string
      ) as JwtPayload;
      return Ok(payload);
    } catch (error) {
      return Err(new UnauthenticatedError("Invalid refresh token"));
    }
  }
}
export default JwtService;
