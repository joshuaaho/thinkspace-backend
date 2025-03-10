import notificationValidation from '#validations/notification.validation';
import notificationController from '#controllers/notification.controller';
import validate from '#middleware/validate';
import auth from '#middleware/auth';
import { Router } from 'express';

const router = Router();

router.post('/:notificationId/read', auth, validate(notificationValidation.markAsRead), notificationController.markAsRead);

export default router;
