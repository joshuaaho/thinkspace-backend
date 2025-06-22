import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import RefreshUseCase, {
  RefreshCommand,
} from "@application/useCases/authentication/refresh";
import CONSTANTS from "@containers/constants";
import { ToZodSchema } from "@zod";
import z from "zod";

@injectable()
class RefreshController {
  private refreshUseCase: RefreshUseCase;

  constructor(
    @inject(CONSTANTS.RefreshUseCase) refreshUseCase: RefreshUseCase
  ) {
    this.refreshUseCase = refreshUseCase;
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.cookies || !req.cookies.jwt) {
        return res.status(400).json({ error: "Refresh token is required" });
      }

      const schema = z.object({
        refreshToken: z.string(),
      } satisfies ToZodSchema<RefreshCommand>);

      const validationResult = schema.safeParse({
        refreshToken: req.cookies.jwt,
      });

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }
      const result = await this.refreshUseCase.execute({
        refreshToken: validationResult.data.refreshToken,
      });

      if (result.isErr()) {
        return res.status(400).json({ error: result.error.message });
      }

      const { accessToken } = result.value;

      return res.status(201).json({ accessToken });
    } catch (error) {
      next(error);
    }
  }
}

export default RefreshController;
