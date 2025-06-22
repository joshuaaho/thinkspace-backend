
import { Router } from "express";

import DeletePostController from "@presentation/controllers/posts/delete";
import CONSTANTS from "@containers/constants";
import { AuthMiddleware } from "@presentation/middleware/auth";
import CreatePostController from "@presentation/controllers/posts/create";
import container from "@containers/index";
import LikePostController from "@presentation/controllers/posts/like";
import UnlikePostController from "@presentation/controllers/posts/unlike";
import EditPostController from "@presentation/controllers/posts/edit";
import GetPostByIdController from "@presentation/controllers/posts/getById";
import QueryPostsController from "@presentation/controllers/posts/query";
const router = Router();
const authMiddleware = container.get<AuthMiddleware>(CONSTANTS.AuthMiddleware);
const queryPostController = container.get<QueryPostsController>(
  CONSTANTS.QueryPostsController
);
const getPostByIdController = container.get<GetPostByIdController>(
  CONSTANTS.GetPostByIdController
);
const deletePostController = container.get<DeletePostController>(
  CONSTANTS.DeletePostController
);
const createPostController = container.get<CreatePostController>(
  CONSTANTS.CreatePostController
);
const likePostController = container.get<LikePostController>(
  CONSTANTS.LikePostController
);
const unlikePostController = container.get<UnlikePostController>(
  CONSTANTS.UnlikePostController
);
const editPostController = container.get<EditPostController>(
  CONSTANTS.EditPostController
);
router.get("/", queryPostController.queryPosts.bind(queryPostController));
router.get("/:postId", getPostByIdController.getPostById.bind(getPostByIdController));
router.delete(
  "/:postId",
  authMiddleware.authenticate,
  deletePostController.deletePost.bind(deletePostController)
);

router.post(
  "/",
  authMiddleware.authenticate,
  createPostController.createPost.bind(createPostController)
);


// 


router.post(
  "/:postId/like",
  authMiddleware.authenticate,
  likePostController.likePost.bind(likePostController)
);


router.post(
  "/:postId/unlike",
  authMiddleware.authenticate,
  unlikePostController.unlikePost.bind(unlikePostController)
);


router.patch(
  "/:postId",
  authMiddleware.authenticate,
    editPostController.editPost.bind(editPostController)
);
export default router;
