import authRoute from '#routes/auth.routes';
import commentRoute from '#routes/comment.routes';
import postRoute from '#routes/post.routes';
import userRoute from '#routes/user.routes';
import chatRoute from '#routes/chat.routes';
import messageRoute from '#routes/message.routes';
import notificationRoute from '#routes/notification.routes';
import { Router } from 'express';
const router = Router();
router.use('/auth', authRoute);
router.use('/comments', commentRoute);
router.use('/posts', postRoute);
router.use('/users', userRoute);
router.use('/chats', chatRoute);
router.use('/messages', messageRoute);
router.use('/notifications', notificationRoute);

export default router;
