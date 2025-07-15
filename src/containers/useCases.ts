import { Container } from "inversify";

import GetUserById from "@application/useCases/users/getById";
import GetMe from "@application/useCases/users/getMe";
import EditUser from "@application/useCases/users/edit";
import Follow from "@application/useCases/users/follow";
import Unfollow from "@application/useCases/users/unfollow";
import QueryUsers from "@application/useCases/users/query";
import QueryNotifications from "@application/useCases/notifications/query";
import GetUnreadCount from "@application/useCases/notifications/getUnreadCount";
import MarkAsRead from "@application/useCases/notifications/markAsRead";
import CreatePost from "@application/useCases/posts/create";
import DeletePost from "@application/useCases/posts/delete";
import EditPost from "@application/useCases/posts/edit";
import GetPostById from "@application/useCases/posts/getById";
import LikePost from "@application/useCases/posts/like";
import UnlikePost from "@application/useCases/posts/unlike";
import QueryPosts from "@application/useCases/posts/query";
import CreateComment from "@application/useCases/comments/create";
import DeleteComment from "@application/useCases/comments/delete";
import EditComment from "@application/useCases/comments/edit";
import LikeComment from "@application/useCases/comments/like";
import UnlikeComment from "@application/useCases/comments/unlike";
import QueryComments from "@application/useCases/comments/query";
import QueryMessages from "@application/useCases/messages/query";
import GetChatList from "@application/useCases/messages/getChatList";
import CreateMessage from "@application/useCases/messages/create";
import CreateFileUploadUrl from "@application/useCases/files/createFileUploadUrl";
import CONSTANTS from "@containers/constants";
import Login from "@application/useCases/authentication/login";
import Register from "@application/useCases/authentication/register";
import Logout from "@application/useCases/authentication/logout";
import Refresh from "@application/useCases/authentication/refresh";

export function bindUseCases(container: Container) {
  // User use cases
  container.bind<GetUserById>(CONSTANTS.GetUserByIdUseCase).to(GetUserById);
  container.bind<GetMe>(CONSTANTS.GetMeUseCase).to(GetMe);
  container.bind<EditUser>(CONSTANTS.EditUserUseCase).to(EditUser);
  container.bind<Follow>(CONSTANTS.FollowUserUseCase).to(Follow);
  container.bind<Unfollow>(CONSTANTS.UnfollowUserUseCase).to(Unfollow);
  container.bind<QueryUsers>(CONSTANTS.QueryUsersUseCase).to(QueryUsers);

  // Notification use cases
  container
    .bind<QueryNotifications>(CONSTANTS.QueryNotificationsUseCase)
    .to(QueryNotifications);
  container
    .bind<GetUnreadCount>(CONSTANTS.GetUnreadCountUseCase)
    .to(GetUnreadCount);
  container.bind<MarkAsRead>(CONSTANTS.MarkAsReadUseCase).to(MarkAsRead);

  // Post use cases
  container.bind<CreatePost>(CONSTANTS.CreatePostUseCase).to(CreatePost);
  container.bind<DeletePost>(CONSTANTS.DeletePostUseCase).to(DeletePost);
  container.bind<EditPost>(CONSTANTS.EditPostUseCase).to(EditPost);
  container.bind<GetPostById>(CONSTANTS.GetPostByIdUseCase).to(GetPostById);
  container.bind<LikePost>(CONSTANTS.LikePostUseCase).to(LikePost);
  container.bind<UnlikePost>(CONSTANTS.UnlikePostUseCase).to(UnlikePost);
  container.bind<QueryPosts>(CONSTANTS.QueryPostsUseCase).to(QueryPosts);

  // Comment use cases
  container
    .bind<CreateComment>(CONSTANTS.CreateCommentUseCase)
    .to(CreateComment);
  container
    .bind<DeleteComment>(CONSTANTS.DeleteCommentUseCase)
    .to(DeleteComment);
  container.bind<EditComment>(CONSTANTS.EditCommentUseCase).to(EditComment);

  container.bind<LikeComment>(CONSTANTS.LikeCommentUseCase).to(LikeComment);
  container
    .bind<UnlikeComment>(CONSTANTS.UnlikeCommentUseCase)
    .to(UnlikeComment);
  container
    .bind<QueryComments>(CONSTANTS.QueryCommentsUseCase)
    .to(QueryComments);

  // Message use cases
  container
    .bind<QueryMessages>(CONSTANTS.QueryMessagesUseCase)
    .to(QueryMessages);
  container
    .bind<CreateMessage>(CONSTANTS.CreateMessageUseCase)
    .to(CreateMessage);
  container.bind<GetChatList>(CONSTANTS.GetChatListUseCase).to(GetChatList);

  // File upload use cases
  container
    .bind<CreateFileUploadUrl>(CONSTANTS.CreateFileUploadUrlUseCase)
    .to(CreateFileUploadUrl);

  // Auth use cases
  container.bind<Login>(CONSTANTS.LoginUseCase).to(Login);
  container.bind<Register>(CONSTANTS.RegisterUseCase).to(Register);
  container.bind<Logout>(CONSTANTS.LogoutUseCase).to(Logout);
  container.bind<Refresh>(CONSTANTS.RefreshUseCase).to(Refresh);
}
