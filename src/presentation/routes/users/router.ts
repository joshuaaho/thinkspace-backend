import express from "express";
import container from "@containers/index";
import CONSTANTS from "@containers/constants";
// import FollowUserController from "@presentation/controllers/users/follow";
// import UnfollowUserController from "@presentation/controllers/users/unfollow";
import { AuthMiddleware } from "@presentation/middleware/auth";
import GetMeController from "@presentation/controllers/users/getMe";
import QueryUsersController from "@presentation/controllers/users/query";
import GetUserByIdController from "@presentation/controllers/users/getById";
import EditUserController from "@presentation/controllers/users/edit";

const router = express.Router();

// const followUserController = container.get<FollowUserController>(
//   CONSTANTS.FollowUserController
// );

const getUserByIdController = container.get<GetUserByIdController>(
  CONSTANTS.GetUserByIdController
);

// const unfollowUserController = container.get<UnfollowUserController>(
//   CONSTANTS.UnfollowUserController
// );

const queryUsersController = container.get<QueryUsersController>(
  CONSTANTS.QueryUsersController
);

const authMiddleware = container.get<AuthMiddleware>(CONSTANTS.AuthMiddleware);

const getMeController = container.get<GetMeController>(
  CONSTANTS.GetMeController
);

const editUserController = container.get<EditUserController>(
  CONSTANTS.EditUserController
);

// Query Users
router.get("/", queryUsersController.queryUsers.bind(queryUsersController));

// Follow a user

// router.post(
//   "/:userId/follow",
//   authMiddleware.authenticate,
//   followUserController.follow.bind(followUserController)
// );

// // Unfollow a user
// router.delete(
//   "/:userId/follow",
//   authMiddleware.authenticate,
//   unfollowUserController.unfollow.bind(unfollowUserController)
// );

router.get(
  "/me",
  authMiddleware.authenticate,
  getMeController.handleGetMe.bind(getMeController)
);

router.get(
  "/:userId",
  getUserByIdController.handleGetById.bind(getUserByIdController)
);

router.patch(
  "/me",
  authMiddleware.authenticate,
  editUserController.handleEdit.bind(editUserController)
);

export default router;
