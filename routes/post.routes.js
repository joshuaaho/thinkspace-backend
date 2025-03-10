import postValidation from '#validations/post.validation';
import postController from '#controllers/post.controller';
import validate from '#middleware/validate';
import auth from '#middleware/auth';
import { Router } from 'express';

const router = Router();

router.get('/:postId', validate(postValidation.getPostById), postController.getPostById);
router.get(
  '/',

  validate(postValidation.queryPosts),
  postController.queryPosts,
);
router.delete('/:postId', auth, validate(postValidation.deletePostById), postController.deletePostById);

router.post('/', auth, validate(postValidation.createPost), postController.createPost);
router.post('/:postId/like', auth, validate(postValidation.likePostById), postController.likePostById);
router.post('/:postId/unlike', auth, validate(postValidation.unlikePostById), postController.unlikePostById);

export default router;
