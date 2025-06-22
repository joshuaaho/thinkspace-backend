// import { NextFunction, Request, Response } from "express";
// import { inject, injectable } from "inversify";
// import SERVICES from "@utils/containers/containerServices";
// import { z } from "zod";
// import { ToZodSchema } from "@zod";
// import {
//   ResourceNotFoundError,
//   InvalidRequestError,
// } from "@application/useCases/errors";
// import { AuthenticatedRequest } from "@presentation/middleware/auth";
// import Unfollow, { UnfollowCommand } from "@application/useCases/users/unfollow";

// @injectable()
// class UnfollowController {
//   private unfollowUseCase: Unfollow;

//   constructor(
//     @inject(SERVICES.UnfollowUserUseCase) unfollowUseCase: Unfollow
//   ) {
//     this.unfollowUseCase = unfollowUseCase;
//   }

//   async handleUnfollow(req: Request, res: Response, next: NextFunction) {
//     try {
//       const schema = z.object({
//         userId: z.string(),
//       } satisfies ToZodSchema<UnfollowCommand>);

//       const validationResult = schema.safeParse({
//         userId: req.params.userId,
//       });

//       if (!validationResult.success) {
//         return res.status(400).json({ error: "Invalid request" });
//       }

//       const result = await this.unfollowUseCase.execute(
//         validationResult.data,
//         (req as AuthenticatedRequest).requestor
//       );

//       if (result.isErr()) {
//         if (result.error instanceof ResourceNotFoundError) {
//           return res.status(404).json({ error: result.error.message });
//         }
//         if (result.error instanceof InvalidRequestError) {
//           return res.status(400).json({ error: result.error.message });
//         }
//       }

//       return res.status(200).json();
//     } catch (error) {
//       next(error);
//     }
//   }
// }

// export default UnfollowController; 