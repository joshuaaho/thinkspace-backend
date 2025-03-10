import authValidation from '#validations/auth.validation';
import authController from '#controllers/auth.controller';
import validate from '#middleware/validate';
import { Router } from 'express';

const router = Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
