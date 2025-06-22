import DeleteRepliesOnCommentDeleted from "@application/subscriptions/DeleteRepliesOnCommentDeleted";
import DeleteCommentsOnPostDeleted from "@application/subscriptions/DeleteCommentsOnPostDeleted";
import NotifyPostAuthorOnPostLiked from "@application/subscriptions/NotifyPostAuthorOnPostLiked";
import NotifyReceiverOnMessageCreated from "@application/subscriptions/NotifyReceiverOnMessageCreated";
import NotifyFollowerOnPostCreated from "@application/subscriptions/NotifyFollowerOnPostCreated";
import NotifyPostAuthorOnCommentCreated from "@application/subscriptions/NotifyPostAuthorOnCommentCreated";
import SendMessageOnMessageCreated from "@application/subscriptions/SendMessageOnMessageCreated";
import NotifyCommentAuthorOnCommentCreated from "@application/subscriptions/NotifyCommentAuthorOnCommentCreated";
import NotifyCommentAuthorOnCommentLiked from "@application/subscriptions/NotifyCommentAuthorOnCommentLiked";
import { Container } from "inversify";
import CONSTANTS from "@containers/constants";




export function bindSubscriptions(container: Container) {
  // Subscribers
  container.bind<DeleteRepliesOnCommentDeleted>(CONSTANTS.DeleteRepliesOnCommentDeleted).to(DeleteRepliesOnCommentDeleted);
  container.bind<DeleteCommentsOnPostDeleted>(CONSTANTS.DeleteCommentsOnPostDeleted).to(DeleteCommentsOnPostDeleted);
  container.bind<NotifyPostAuthorOnPostLiked>(CONSTANTS.NotifyPostAuthorOnPostLiked).to(NotifyPostAuthorOnPostLiked);
  container.bind<NotifyReceiverOnMessageCreated>(CONSTANTS.NotifyReceiverOnMessageCreated).to(NotifyReceiverOnMessageCreated);
  container.bind<NotifyFollowerOnPostCreated>(CONSTANTS.NotifyFollowerOnPostCreated).to(NotifyFollowerOnPostCreated);
  container.bind<NotifyPostAuthorOnCommentCreated>(CONSTANTS.NotifyPostAuthorOnCommentCreated).to(NotifyPostAuthorOnCommentCreated);
  container.bind<SendMessageOnMessageCreated>(CONSTANTS.SendMessageOnMessageCreated).to(SendMessageOnMessageCreated);
  container.bind<NotifyCommentAuthorOnCommentCreated>(CONSTANTS.NotifyCommentAuthorOnCommentCreated).to(NotifyCommentAuthorOnCommentCreated);
  container.bind<NotifyCommentAuthorOnCommentLiked>(CONSTANTS.NotifyCommentAuthorOnCommentLiked).to(NotifyCommentAuthorOnCommentLiked);
} 