import { Router } from 'express';
import validate from '#middleware/validate';
import auth from '#middleware/auth';
import chatController from '#controllers/chat.controller';
import chatValidation from '#validations/chat.validation';
const router = Router();

router.post('/', auth, validate(chatValidation.createChat), chatController.createChat);

router.get('/', auth, validate(chatValidation.getChats), chatController.getChats);

export default router;
