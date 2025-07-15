import { inject, injectable } from "inversify";
import CONSTANTS from "@containers/constants";
import { z } from "zod";
import { ToZodSchema } from "@zod";
import { AuthenticatedRequest } from "@presentation/middleware/auth";
import EditUser, { EditUserCommand } from "@application/useCases/users/edit";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from "express";
import {
  Controller,
  Middlewares,
  Route,
  Response,
  SuccessResponse,
  Body,
  Request,
  Security,
  Patch,
  Tags,
} from "tsoa";
import { HTTPError } from "@presentation/middleware/errorHandler";

async function customMiddleware(
  req: ExpressRequest,
  res: ExpressResponse,
  next: ExpressNextFunction,
) {
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
    return next(validationResult.error);
  }
  return next();
}

@injectable()
@Tags("Users")
@Route("users")
@Security("bearerAuth")
export class EditUserController extends Controller {
  private editUserUseCase: EditUser;

  constructor(@inject(CONSTANTS.EditUserUseCase) editUserUseCase: EditUser) {
    super();
    this.editUserUseCase = editUserUseCase;
  }

  @Patch("/me")
  @Middlewares(customMiddleware)
  @Response<HTTPError>(400, "Validation error or invalid HTTP request")
  @Response<HTTPError>(401, "Unauthenticated")
  @SuccessResponse("200", "User Edited Successfully")
  async handleEdit(
    @Body() body: EditUserCommand,
    @Request() req: AuthenticatedRequest,
  ) {
    const data = await this.editUserUseCase.execute(body, req.user);

    if (data.isErr()) {
      throw data.error;
    }

    this.setStatus(200);
    return;
  }
}
