import { iocContainer } from "@containers/index";
import CONSTANTS from "@containers/constants";
import SendMessageOnMessageCreated from "@application/subscriptions/SendMessageOnMessageCreated";
import NotifyFollowerOnPostCreated from "@application/subscriptions/NotifyFollowerOnPostCreated";
import NotifyReceiverOnMessageCreated from "@application/subscriptions/NotifyReceiverOnMessageCreated";
import NotifyCommentAuthorOnCommentCreated from "@application/subscriptions/NotifyCommentAuthorOnCommentCreated";
import DeleteRepliesOnCommentDeleted from "@application/subscriptions/DeleteRepliesOnCommentDeleted";
import DeleteCommentsOnPostDeleted from "@application/subscriptions/DeleteCommentsOnPostDeleted";
import NotifyPostAuthorOnPostLiked from "@application/subscriptions/NotifyPostAuthorOnPostLiked";
import NotifyCommentAuthorOnCommentLiked from "@application/subscriptions/NotifyCommentAuthorOnCommentLiked";
import NotifyPostAuthorOnCommentCreated from "@application/subscriptions/NotifyPostAuthorOnCommentCreated";

export const initializeSubscriptions = () => {
  const deleteRepliesOnCommentDeleted =
    iocContainer.get<DeleteRepliesOnCommentDeleted>(
      CONSTANTS.DeleteRepliesOnCommentDeleted,
    );

  const notifyPostAuthorOnPostLiked =
    iocContainer.get<NotifyPostAuthorOnPostLiked>(
      CONSTANTS.NotifyPostAuthorOnPostLiked,
    );
  const deleteCommentsOnPostDeleted =
    iocContainer.get<DeleteCommentsOnPostDeleted>(
      CONSTANTS.DeleteCommentsOnPostDeleted,
    );

  const sendMessageOnMessageCreated =
    iocContainer.get<SendMessageOnMessageCreated>(
      CONSTANTS.SendMessageOnMessageCreated,
    );
  const notifyFollowerOnPostCreated =
    iocContainer.get<NotifyFollowerOnPostCreated>(
      CONSTANTS.NotifyFollowerOnPostCreated,
    );
  const notifyCommentAuthorOnCommentLiked =
    iocContainer.get<NotifyCommentAuthorOnCommentLiked>(
      CONSTANTS.NotifyCommentAuthorOnCommentLiked,
    );
  const notifyCommentAuthorOnCommentCreated =
    iocContainer.get<NotifyCommentAuthorOnCommentCreated>(
      CONSTANTS.NotifyCommentAuthorOnCommentCreated,
    );
  const notifyPostAuthorOnCommentCreated =
    iocContainer.get<NotifyPostAuthorOnCommentCreated>(
      CONSTANTS.NotifyPostAuthorOnCommentCreated,
    );

  const notifyReceiverOnMessageCreated =
    iocContainer.get<NotifyReceiverOnMessageCreated>(
      CONSTANTS.NotifyReceiverOnMessageCreated,
    );

  notifyPostAuthorOnPostLiked.setupSubscriptions();
  notifyReceiverOnMessageCreated.setupSubscriptions();
  deleteRepliesOnCommentDeleted.setupSubscriptions();
  sendMessageOnMessageCreated.setupSubscriptions();
  notifyFollowerOnPostCreated.setupSubscriptions();
  notifyCommentAuthorOnCommentCreated.setupSubscriptions();
  notifyCommentAuthorOnCommentLiked.setupSubscriptions();
  notifyPostAuthorOnCommentCreated.setupSubscriptions();
  deleteCommentsOnPostDeleted.setupSubscriptions();
};
