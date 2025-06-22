import container from "@containers/index";
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
;
  const deleteRepliesOnCommentDeleted =
    container.get<DeleteRepliesOnCommentDeleted>(
      CONSTANTS.DeleteRepliesOnCommentDeleted
    );

  const notifyPostAuthorOnPostLiked =
    container.get<NotifyPostAuthorOnPostLiked>(
      CONSTANTS.NotifyPostAuthorOnPostLiked
    );
  const deleteCommentsOnPostDeleted =
    container.get<DeleteCommentsOnPostDeleted>(
      CONSTANTS.DeleteCommentsOnPostDeleted
    );


  const sendMessageOnMessageCreated =
    container.get<SendMessageOnMessageCreated>(
      CONSTANTS.SendMessageOnMessageCreated
    );
  const notifyFollowerOnPostCreated =
    container.get<NotifyFollowerOnPostCreated>(
      CONSTANTS.NotifyFollowerOnPostCreated
    );
  const notifyCommentAuthorOnCommentLiked =
    container.get<NotifyCommentAuthorOnCommentLiked>(
      CONSTANTS.NotifyCommentAuthorOnCommentLiked
    );
  const notifyCommentAuthorOnCommentCreated =
    container.get<NotifyCommentAuthorOnCommentCreated>(
      CONSTANTS.NotifyCommentAuthorOnCommentCreated
    );
  const notifyPostAuthorOnCommentCreated =
    container.get<NotifyPostAuthorOnCommentCreated>(
      CONSTANTS.NotifyPostAuthorOnCommentCreated
    );
  
  const notifyReceiverOnMessageCreated =
    container.get<NotifyReceiverOnMessageCreated>(
      CONSTANTS.NotifyReceiverOnMessageCreated
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
