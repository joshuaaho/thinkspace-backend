import { Router } from "express";
import CONSTANTS from "@containers/constants";
import container from "@containers/index";
import { AuthMiddleware } from "@presentation/middleware/auth";
import QueryNotificationsController from "@presentation/controllers/notifications/query";
import UnreadNotificationsController from "@presentation/controllers/notifications/getUnreadCount";
import MarkAsReadController from "@presentation/controllers/notifications/markAsRead";

const router = Router();
const authMiddleware = container.get<AuthMiddleware>(CONSTANTS.AuthMiddleware);
const queryNotificationsController =
  container.get<QueryNotificationsController>(
    CONSTANTS.QueryNotificationsController
  );
const unreadNotificationsController =
  container.get<UnreadNotificationsController>(
    CONSTANTS.GetUnreadCountController
  );
const markAsReadController = container.get<MarkAsReadController>(CONSTANTS.MarkAsReadController);

// Apply auth middleware to all notification routes
router.use(authMiddleware.authenticate.bind(authMiddleware));

// Notification routes
router.get(
  "/",
  queryNotificationsController.handleQuery.bind(queryNotificationsController)
);
router.get(
  "/unread",
  unreadNotificationsController.handleGetUnreadCount.bind(
    unreadNotificationsController
  )
);
router.post('/read', markAsReadController.handleMarkAsRead.bind(markAsReadController));

export default router;
