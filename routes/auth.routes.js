import { Router } from 'express';
import { validate } from '../middleware/index.js';
import { authController } from '../controllers/index.js';
import { authValidation } from '../validations/index.js';
const router = Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.get('/logout', authController.logout);
router.get('/refresh', authController.refresh);

export default router;
