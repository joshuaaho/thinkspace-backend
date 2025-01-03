import express from "express";
import { postValidation } from "../validations/index.js";
import { postController } from "../controllers/index.js";
import { auth, validate } from "../middleware/index.js";
const router = express.Router();

router.get(
  "/:postId",
  validate(postValidation.getPostById),
  postController.getPostById
);
router.get(
  "/",

  validate(postValidation.queryPosts),
  postController.queryPosts
);
router.delete(
  "/:postId",
  auth,
  validate(postValidation.deletePostById),
  postController.deletePostById
);

router.post(
  "/",
  auth,
  validate(postValidation.createPost),
  postController.createPost
);
router.post(
  "/:postId/like",
  auth,
  validate(postValidation.likePostById),
  postController.likePostById
);
router.post(
  "/:postId/unlike",
  auth,
  validate(postValidation.unlikePostById),
  postController.unlikePostById
);

export default router;
