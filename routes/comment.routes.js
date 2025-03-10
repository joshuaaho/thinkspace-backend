import express from 'express';
import validate from '#middleware/validate';
import auth from '#middleware/auth';
import commentController from '#controllers/comment.controller';
import commentValidation from '#validations/comment.validation';
const router = express.Router();

router.post('/', auth, validate(commentValidation.createComment), commentController.createComment);
router.patch('/:commentId', auth, validate(commentValidation.updateCommentById), commentController.updateCommentById);
router.delete('/:commentId', auth, validate(commentValidation.deleteCommentById), commentController.deleteCommentById);
router.get('/', validate(commentValidation.queryComments), commentController.queryComments);
router.post('/:commentId/like', auth, validate(commentValidation.likeCommentById), commentController.likeCommentById);
router.post('/:commentId/unlike', auth, validate(commentValidation.unlikeCommentById), commentController.unlikeCommentById);

export default router;
