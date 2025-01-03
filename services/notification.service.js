import { Notification } from '../models/index.js';
import AppError from '../classes/AppError.js';
const markAsRead = async (notificationId, user) => {
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

  return updatedNotification;
};

export default { markAsRead };
