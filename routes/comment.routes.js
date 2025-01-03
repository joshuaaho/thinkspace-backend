import express from "express";

import { auth, validate } from "../middleware/index.js";
import { commentController } from "../controllers/index.js";
import { commentValidation } from "../validations/index.js";
const router = express.Router();

router.post(
  "/",
  auth,
  validate(commentValidation.createComment),
  commentController.createComment
);
router.patch(
  "/:commentId",
  auth,
  validate(commentValidation.updateCommentById),
  commentController.updateCommentById
);
router.delete(
  "/:commentId",
  auth,
  validate(commentValidation.deleteCommentById),
  commentController.deleteCommentById
);
router.get(
  "/",
  validate(commentValidation.queryComments),
  commentController.queryComments
);
router.post(
  "/:commentId/like",
  auth,
  validate(commentValidation.likeCommentById),
  commentController.likeCommentById
);
router.post(
  "/:commentId/unlike",
  auth,
  validate(commentValidation.unlikeCommentById),
  commentController.unlikeCommentById
);

export default router;
