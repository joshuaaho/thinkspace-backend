import notificationService from '#services/notification.service';

const markAsRead = async (req, res, next) => {
  try {
    const updatedNotification = await notificationService.markAsRead(req.params.notificationId, req.user);
    return res.status(200).json(updatedNotification);
  } catch (err) {
    return next(err);
  }
};

export default {
  markAsRead,
};
