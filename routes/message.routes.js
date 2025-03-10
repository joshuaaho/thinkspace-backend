import messageValidation from '#validations/message.validation';
import messageController from '#controllers/message.controller';
import validate from '#middleware/validate';
import auth from '#middleware/auth';
import { Router } from 'express';

const router = Router();

router.post('/', auth, messageController.sendMessage);
router.get('/', auth, validate(messageValidation.getMessages), messageController.getMessages);

export default router;
