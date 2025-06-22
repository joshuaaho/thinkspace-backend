import { Container } from "inversify";

import GetByIdController from "@presentation/controllers/users/getById";
import GetMeController from "@presentation/controllers/users/getMe";
import EditUserController from "@presentation/controllers/users/edit";
    // import FollowController from "@presentation/controllers/users/follow";
    // import UnfollowController from "@presentation/controllers/users/unfollow";
import QueryUsersController from "@presentation/controllers/users/query";
import QueryNotificationsController from "@presentation/controllers/notifications/query";
import GetUnreadCountController from "@presentation/controllers/notifications/getUnreadCount";
import MarkAsReadController from "@presentation/controllers/notifications/markAsRead";
import CreatePostController from "@presentation/controllers/posts/create";
import DeletePostController from "@presentation/controllers/posts/delete";
import EditPostController from "@presentation/controllers/posts/edit";
import GetPostByIdController from "@presentation/controllers/posts/getById";
import LikePostController from "@presentation/controllers/posts/like";
import UnlikePostController from "@presentation/controllers/posts/unlike";
import QueryPostsController from "@presentation/controllers/posts/query";
import CreateCommentController from "@presentation/controllers/comments/create";
import DeleteCommentController from "@presentation/controllers/comments/delete";
import EditCommentController from "@presentation/controllers/comments/edit";
import LikeCommentController from "@presentation/controllers/comments/like";
import UnlikeCommentController from "@presentation/controllers/comments/unlike";
import QueryCommentsController from "@presentation/controllers/comments/query";
import QueryMessagesController from "@presentation/controllers/messages/query";
import GetChatListController from "@presentation/controllers/messages/getChatList";
import CreateMessageController from "@presentation/controllers/messages/create";
import CreateFileUploadUrlController from "@presentation/controllers/files/createFileUploadUrl";
import  CONSTANTS  from "@containers/constants";
import LoginController from "@presentation/controllers/auth/login";
import RegisterController from "@presentation/controllers/auth/register";
import LogoutController from "@presentation/controllers/auth/logout";
import RefreshController from "@presentation/controllers/auth/refresh";

export function bindControllers(container: Container) {
  // User controllers
  container
    .bind<GetByIdController>(CONSTANTS.GetUserByIdController)
    .to(GetByIdController);
  container.bind<GetMeController>(CONSTANTS.GetMeController).to(GetMeController);
  container
        .bind<EditUserController>(CONSTANTS.EditUserController)
    .to(EditUserController);
  // container
  //   .bind<FollowController>(CONSTANTS.FollowUserController)
  //   .to(FollowController);
  // container
  //   .bind<UnfollowController>(CONSTANTS.UnfollowUserController)
  //   .to(UnfollowController);
  container
    .bind<QueryUsersController>(CONSTANTS.QueryUsersController)
    .to(QueryUsersController);

  // Notification controllers
  container
    .bind<QueryNotificationsController>(CONSTANTS.QueryNotificationsController)
    .to(QueryNotificationsController);
  container
    .bind<GetUnreadCountController>(CONSTANTS.GetUnreadCountController)
    .to(GetUnreadCountController);
  container
    .bind<MarkAsReadController>(CONSTANTS.MarkAsReadController)
    .to(MarkAsReadController);

  // Post controllers
  container
    .bind<CreatePostController>(CONSTANTS.CreatePostController)
    .to(CreatePostController);
  container
    .bind<DeletePostController>(CONSTANTS.DeletePostController)
    .to(DeletePostController);
  container
    .bind<EditPostController>(CONSTANTS.EditPostController)
    .to(EditPostController);
  container
    .bind<GetPostByIdController>(CONSTANTS.GetPostByIdController)
    .to(GetPostByIdController);
  container
        .bind<LikePostController>(CONSTANTS.LikePostController)
    .to(LikePostController);
  container
    .bind<UnlikePostController>(CONSTANTS.UnlikePostController)
    .to(UnlikePostController);
  container
    .bind<QueryPostsController>(CONSTANTS.QueryPostsController)
    .to(QueryPostsController);

  // Comment controllers
  container
    .bind<CreateCommentController>(CONSTANTS.CreateCommentController)
    .to(CreateCommentController);
  container
    .bind<DeleteCommentController>(CONSTANTS.DeleteCommentController)
    .to(DeleteCommentController);
  container
    .bind<EditCommentController>(CONSTANTS.EditCommentController)
    .to(EditCommentController);

  container
    .bind<LikeCommentController>(CONSTANTS.LikeCommentController)
    .to(LikeCommentController);
  container
    .bind<UnlikeCommentController>(CONSTANTS.UnlikeCommentController)
    .to(UnlikeCommentController);
  container
    .bind<QueryCommentsController>(CONSTANTS.QueryCommentsController)
    .to(QueryCommentsController);

  // Message controllers
  container
    .bind<QueryMessagesController>(CONSTANTS.QueryMessagesController)
    .to(QueryMessagesController);
  container
    .bind<CreateMessageController>(CONSTANTS.CreateMessageController)
    .to(CreateMessageController);
  container
    .bind<GetChatListController>(CONSTANTS.GetChatListController)
    .to(GetChatListController);

  
  
  // File upload controllers
  container
    .bind<CreateFileUploadUrlController>(CONSTANTS.CreateFileUploadUrlController)
    .to(CreateFileUploadUrlController);
  
  container.bind<LoginController>(CONSTANTS.LoginController).to(LoginController);
  container.bind<RegisterController>(CONSTANTS.RegisterController).to(RegisterController);
  container.bind<LogoutController>(CONSTANTS.LogoutController).to(LogoutController);
  container.bind<RefreshController>(CONSTANTS.RefreshController).to(RefreshController);
}


