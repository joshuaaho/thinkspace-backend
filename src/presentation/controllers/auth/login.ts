import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import Login, {
  LoginCommand,
} from "@application/useCases/authentication/login";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";

@injectable()
class LoginController {
  private loginUseCase: Login;
  constructor(@inject(CONSTANTS.LoginUseCase) loginUseCase: Login) {
    this.loginUseCase = loginUseCase;
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;

      const schema = z.object({
        username: z.string(),
        password: z.string(),
      } satisfies ToZodSchema<LoginCommand>);

      const result = schema.safeParse(body);

      if (!result.success) {
        return res.status(400).json({error: "Invalid HTTP request"});
      }
      const data = await this.loginUseCase.execute(result.data);

      if (data.isErr()) {
        return res.status(401).json({error: data.error.message});
      }

      const { accessToken, refreshToken } = data.value;

      return res
        .status(200)
        .cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        })
        .json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
}

export default LoginController;