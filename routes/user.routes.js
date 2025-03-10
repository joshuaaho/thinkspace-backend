import userValidation from '#validations/user.validation';
import userController from '#controllers/user.controller';
import validate from '#middleware/validate';
import auth from '#middleware/auth';
import { Router } from 'express';

const router = Router();

router.get('/S3Url', auth, userController.getS3Url);

router.get('/:userId', validate(userValidation.getUserById), userController.getUserById);

router.get('/', validate(userValidation.queryUsers), userController.queryUsers);
router.get('/', validate(userValidation.queryUsers), userController.queryUsers);

router.post('/:userId/follow', auth, validate(userValidation.followUserById), userController.followUserById);

router.post('/:userId/unfollow', auth, validate(userValidation.unfollowUserById), userController.unfollowUserById);

router.get(
  '/:userId/notifications',
  auth,
  validate(userValidation.getUsersNotifications),
  userController.getUsersNotifications,
);

export default router;
