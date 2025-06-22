// import { NextFunction, Request, Response } from "express";
// import { inject, injectable } from "inversify";
// import CONSTANTS from "@containers/constants";
// import { z } from "zod";
// import { ToZodSchema } from "@zod";
// import {
//   ResourceNotFoundError,
//   InvalidRequestError,
// } from "@application/useCases/errors";
// import { AuthenticatedRequest } from "@presentation/middleware/auth";
// import Follow, { FollowCommand } from "@application/useCases/users/follow";
// import IUserRepository from "@domain/repositories/IUserRepository";

// @injectable()
// class FollowController {
//   private followUseCase: Follow;
//   private userRepo: IUserRepository;

//   constructor(
//     @inject(CONSTANTS.FollowUserUseCase) followUseCase: Follow,
//     @inject(CONSTANTS.UserRepository) userRepo: IUserRepository
//   ) {
//     this.followUseCase = followUseCase;
//     this.userRepo = userRepo;
//   }

//   async handleFollow(req: Request, res: Response, next: NextFunction) {
//     try {
//       const schema = z.object({
//         userId: z.string(),
//       } satisfies ToZodSchema<FollowCommand>);

//       const validationResult = schema.safeParse({
//         userId: req.params.userId,
//       });

//       if (!validationResult.success) {
//         return res.status(400).json({ error: "Invalid request" });
//       }

//       const result = await this.followUseCase.execute(
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

//       return res.status(201).json({ message: "Successfully followed user" });
//     } catch (error) {
//       next(error);
//     }
//   }
// }

// export default FollowController;
