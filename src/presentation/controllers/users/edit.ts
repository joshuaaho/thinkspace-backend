import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import { InvalidRequestError } from "@application/useCases/errors";
import { AuthenticatedRequest } from "@presentation/middleware/auth";
import EditUser, { EditUserCommand } from "@application/useCases/users/edit";

@injectable()
class EditUserController {
  private editUserUseCase: EditUser;

  constructor(
    @inject(CONSTANTS.EditUserUseCase) editUserUseCase: EditUser
  ) {
    this.editUserUseCase = editUserUseCase;
  }

  async handleEdit(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        work: z.string().optional(),
        bio: z.string().optional(),
        education: z.string().optional(),
        interest: z.string().optional(),
        location: z.string().optional(),
        profileImgUrl: z.string().url().optional(),
        themePreference: z.enum(["light", "dark", "system"]).optional(),
      } satisfies ToZodSchema<EditUserCommand>);

      const validationResult = schema.safeParse(req.body);

      if (!validationResult.success) {
        return res.status(400).json({ error: "Invalid HTTP request" });
      }

      const result = await this.editUserUseCase.execute(
        validationResult.data,
        (req as AuthenticatedRequest).requestor
      );

      if (result.isErr()) {
        return res.status(400).json({ error: result.error.message });
      }

      return res.status(200).json();
    } catch (error) {
      next(error);
    }
  }
}

export default EditUserController;
