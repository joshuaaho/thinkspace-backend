import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import Register from "@application/useCases/authentication/register";
import CONSTANTS from "@containers/constants";
import { ToZodSchema } from "@zod";
import { z } from "zod";
import { RegisterCommand } from "@application/useCases/authentication/register";
import { ConflictError } from "@application/useCases/errors";
import { ValidationError } from "@domain/errors";
@injectable()
class RegisterController {
  private registerUseCase: Register;
  constructor(@inject(CONSTANTS.RegisterUseCase) registerUseCase: Register) {
    this.registerUseCase = registerUseCase;
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;

      const schema = z.object({
        username: z.string(),
        password: z.string(),
        email: z.string(),
      } satisfies ToZodSchema<RegisterCommand>);

      const result = schema.safeParse(body);

      if (!result.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const data = await this.registerUseCase.execute({
        username: result.data.username,
        password: result.data.password,
        email: result.data.email,
      });

      if (data.isErr()) {
        if (data.error instanceof ConflictError) {
          return res.status(409).json(data.error.message);
        }
        if (data.error instanceof ValidationError) {
          return res.status(400).json(data.error.message);
        }
      }

      return res.status(201).end();
    } catch (error) {
      next(error);
    }
  }
}

export default RegisterController;
