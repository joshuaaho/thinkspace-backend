import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import LogoutUseCase, { LogoutCommand } from "@application/useCases/authentication/logout";
import CONSTANTS from "@containers/constants";
import { ToZodSchema } from "@zod";
import z from "zod";



@injectable()
class LogoutController {
  private logoutUseCase: LogoutUseCase;

  constructor(@inject(CONSTANTS.LogoutUseCase) logoutUseCase: LogoutUseCase) {
    this.logoutUseCase = logoutUseCase;
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {

      

      if (!req.cookies || !req.cookies.jwt) {
        return res.status(204) .json();
      }
      
       const schema = z.object({
        refreshToken: z.string(),
      } satisfies ToZodSchema<LogoutCommand>);

      const validationResult = schema.safeParse({refreshToken: req.cookies.jwt});

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      await this.logoutUseCase.execute({ refreshToken: validationResult.data.refreshToken });

      return res
        .status(200)
        .clearCookie("jwt", {
          httpOnly: true,
          sameSite: "lax",
          secure: true,
        })
        .json();
    } catch (error) {
      next(error);
    }
  }
}

export default LogoutController;
