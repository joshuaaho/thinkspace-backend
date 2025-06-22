import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import IAuthService from "@application/services/IAuthService";
import CONSTANTS from "@containers/constants";
import IUserRepository from "@domain/repositories/IUserRepository";
import User from "@domain/entities/User";

export interface AuthenticatedRequest extends Request {
  requestor: User;
}

@injectable()
export class AuthMiddleware {
  private authService: IAuthService;
  private userRepo: IUserRepository;

  constructor(
    @inject(CONSTANTS.AuthService) authService: IAuthService,
    @inject(CONSTANTS.UserRepository) userRepo: IUserRepository
  ) {
    this.authService = authService;
    this.userRepo = userRepo;
  }

  authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const payload = this.authService.verifyAccessToken(token);

    if (payload.isErr()) {
      return res.status(401).json({ error: payload.error.message });
    }
    
    const user = await this.userRepo.findById(payload.value.userId);
    if (user.isNone()) {
      return res.status(401).json({ error: "User not fougnd" });
    }
    (req as AuthenticatedRequest).requestor = user.value;
    next();
  };
}
