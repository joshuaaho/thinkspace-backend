import Notification from '#models/notification.model';
import AppError from '#classes/AppError';
import logger from '#utils/logger';
import { getUser } from '#utils/context';
const markAsRead = async (notificationId) => {
  const user = getUser();
  const notification = await Notification.findById(notificationId);
  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  if (!user._id.equals(notification.to)) {
    throw new AppError('You do not have access to this notification', 403);
  }
  notification.isRead = true;
  const updatedNotification = await (
    await notification.save()
  ).populate({
    path: 'from',
    select: 'profileImgUrl username',
  });

  logger.info('Notification marked as read');
  return updatedNotification;
};

export default { markAsRead };
