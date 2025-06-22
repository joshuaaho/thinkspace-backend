import { Router } from "express";
import CreateCommentController from "@presentation/controllers/comments/create";
import EditCommentController from "@presentation/controllers/comments/edit";
import DeleteCommentController from "@presentation/controllers/comments/delete";
import LikeCommentController from "@presentation/controllers/comments/like";
import UnlikeCommentController from "@presentation/controllers/comments/unlike";
import CONSTANTS from "@containers/constants";
import container from "@containers/index";
import { AuthMiddleware } from "@presentation/middleware/auth";
import  QueryCommentsController  from "@presentation/controllers/comments/query";

const router = Router();
const authMiddleware = container.get<AuthMiddleware>(CONSTANTS.AuthMiddleware);

const createCommentController = container.get<CreateCommentController>(CONSTANTS.CreateCommentController);
const editCommentController = container.get<EditCommentController>(CONSTANTS.EditCommentController);
const deleteCommentController = container.get<DeleteCommentController>(CONSTANTS.DeleteCommentController);
const likeCommentController = container.get<LikeCommentController>(CONSTANTS.LikeCommentController);
const unlikeCommentController = container.get<UnlikeCommentController>(CONSTANTS.UnlikeCommentController);
const queryCommentsController = container.get<QueryCommentsController>(CONSTANTS.QueryCommentsController);
// Apply auth middleware to all comment routes


// Comment routes
router.get('/', queryCommentsController.query.bind(queryCommentsController));
router.post('/',  authMiddleware.authenticate,createCommentController.create.bind(createCommentController));
router.patch('/:commentId', authMiddleware.authenticate, editCommentController.edit.bind(editCommentController));
router.delete('/:commentId', authMiddleware.authenticate, deleteCommentController.delete.bind(deleteCommentController));
router.post('/:commentId/like', authMiddleware.authenticate, likeCommentController.like.bind(likeCommentController));
router.post('/:commentId/unlike', authMiddleware.authenticate, unlikeCommentController.unlike.bind(unlikeCommentController));

export default router; 