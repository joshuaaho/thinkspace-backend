import auth from '@presentation/routes/auth/router';
import { Router } from 'express';
import post from '@presentation/routes/post/router';
import messages from '@presentation/routes/messages/router';
import comments from '@presentation/routes/comments/router';
import users from '@presentation/routes/users/router';
import notifications from '@presentation/routes/notifications/router';
import files from '@presentation/routes/files/router';
const router = Router();
router.use('/auth', auth);
router.use('/posts', post);
router.use('/messages', messages);
router.use('/comments', comments);
router.use('/users', users);
router.use('/notifications', notifications);
router.use('/files', files);

export default router;