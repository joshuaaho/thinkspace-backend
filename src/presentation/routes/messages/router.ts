import container from "@containers/index";
import { Router } from "express";

import CONSTANTS from "@containers/constants";
import { AuthMiddleware } from "@presentation/middleware/auth";

import CreateMessageController from "@presentation/controllers/messages/create";
import QueryMessagesController from "@presentation/controllers/messages/query";
import GetChatListController from "@presentation/controllers/messages/getChatList";

const router = Router();

const authMiddleware = container.get<AuthMiddleware>(CONSTANTS.AuthMiddleware);

const createMessageController = container.get<CreateMessageController>(
  CONSTANTS.CreateMessageController
);

const queryMessagesController = container.get<QueryMessagesController>(
  CONSTANTS.QueryMessagesController
);
const getChatListController = container.get<GetChatListController>(
  CONSTANTS.GetChatListController
);
router.get(
  "/",
  authMiddleware.authenticate,
  queryMessagesController.queryMessages.bind(queryMessagesController)
);

router.post(
  "/",
  authMiddleware.authenticate,
  createMessageController.createMessage.bind(createMessageController)
);

router.get(
  "/latest",
  authMiddleware.authenticate,
  getChatListController.getChatList.bind(getChatListController)
);

export default router;
