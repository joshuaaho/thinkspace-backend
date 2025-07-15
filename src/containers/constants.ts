// const CONTROLLER_CfONSTANTS = {
//   // Auth Controllers
//   LoginController: Symbol.for("LoginController"),
//   RegisterController: Symbol.for("RegisterController"),
//   LogoutController: Symbol.for("LogoutController"),
//   RefreshController: Symbol.for("RefreshController"),

//   // User Controllers
//   GetMeController: Symbol.for("GetMeController"),
//   GetUserByIdController: Symbol.for("GetUserByIdController"),
//   EditUserController: Symbol.for("EditUserController"),
//   FollowUserController: Symbol.for("FollowUserController"),
//   UnfollowUserController: Symbol.for("UnfollowUserController"),
//   QueryUsersController: Symbol.for("QueryUsersController"),

//   // Post Controllers
//   QueryPostsController: Symbol.for("QueryPostController"),
//   CreatePostController: Symbol.for("CreatePostController"),
//   DeletePostController: Symbol.for("DeletePostController"),
//   EditPostController: Symbol.for("EditPostController"),
//   LikePostController: Symbol.for("LikePostController"),
//   UnlikePostController: Symbol.for("UnlikePostController"),
//   GetPostByIdController: Symbol.for("GetPostByIdController"),

//   // Comment Controllers
//   CreateCommentController: Symbol.for("CreateCommentController"),
//   EditCommentController: Symbol.for("EditCommentController"),
//   DeleteCommentController: Symbol.for("DeleteCommentController"),
//   LikeCommentController: Symbol.for("LikeCommentController"),
//   UnlikeCommentController: Symbol.for("UnlikeCommentController"),
//   QueryCommentsController: Symbol.for("QueryCommentsController"),

//   // Message Controllers
//   CreateMessageController: Symbol.for("CreateMessageController"),
//   QueryMessagesController: Symbol.for("QueryMessagesController"),
//   GetChatListController: Symbol.for("GetChatListController"),

//   // Notification Controllers
//   QueryNotificationsController: Symbol.for("QueryNotificationsController"),
//   GetUnreadCountController: Symbol.for("GetUnreadCountController"),
//   MarkAsReadController: Symbol.for("MarkAsReadController"),

//   // File Upload Controllers
//   CreateFileUploadUrlController: Symbol.for("CreateFileUploadUrlController"),
// };

const REPOSITORY_CONSTANTS = {
  UserRepository: Symbol.for("UserRepository"),
  PostRepository: Symbol.for("PostRepository"),
  CommentRepository: Symbol.for("CommentRepository"),
  NotificationRepository: Symbol.for("NotificationRepository"),
  MessageRepository: Symbol.for("MessageRepository"),
};

const USE_CASE_CONSTANTS = {
  // Auth Use Cases
  LoginUseCase: Symbol.for("LoginUseCase"),
  RegisterUseCase: Symbol.for("RegisterUseCase"),
  LogoutUseCase: Symbol.for("LogoutUseCase"),
  RefreshUseCase: Symbol.for("RefreshUseCase"),

  // User Use Cases
  GetMeUseCase: Symbol.for("GetMeUseCase"),
  GetUserByIdUseCase: Symbol.for("GetUserByIdUseCase"),
  EditUserUseCase: Symbol.for("EditUserUseCase"),
  FollowUserUseCase: Symbol.for("FollowUserUseCase"),
  UnfollowUserUseCase: Symbol.for("UnfollowUserUseCase"),
  QueryUsersUseCase: Symbol.for("QueryUsersUseCase"),

  // Post Use Cases
  QueryPostsUseCase: Symbol.for("QueryPostsUseCase"),
  CreatePostUseCase: Symbol.for("CreatePostUseCase"),
  DeletePostUseCase: Symbol.for("DeletePostUseCase"),
  EditPostUseCase: Symbol.for("EditPostUseCase"),
  LikePostUseCase: Symbol.for("LikePostUseCase"),
  UnlikePostUseCase: Symbol.for("UnlikePostUseCase"),
  GetPostByIdUseCase: Symbol.for("GetPostByIdUseCase"),

  // Comment Use Cases
  CreateCommentUseCase: Symbol.for("CreateCommentUseCase"),
  EditCommentUseCase: Symbol.for("EditCommentUseCase"),
  DeleteCommentUseCase: Symbol.for("DeleteCommentUseCase"),
  LikeCommentUseCase: Symbol.for("LikeCommentUseCase"),
  UnlikeCommentUseCase: Symbol.for("UnlikeCommentUseCase"),
  QueryCommentsUseCase: Symbol.for("QueryCommentsUseCase"),

  // Message Use Cases
  CreateMessageUseCase: Symbol.for("CreateMessageUseCase"),
  QueryMessagesUseCase: Symbol.for("QueryMessagesUseCase"),
  GetChatListUseCase: Symbol.for("GetChatListUseCase"),

  // Notification Use Cases
  QueryNotificationsUseCase: Symbol.for("QueryNotificationsUseCase"),
  GetUnreadCountUseCase: Symbol.for("GetUnreadCountUseCase"),
  MarkAsReadUseCase: Symbol.for("MarkAsReadUseCase"),

  // File Upload Use Cases
  CreateFileUploadUrlUseCase: Symbol.for("CreateFileUploadUrlUseCase"),
};

export const SUBSCRIPTION_CONSTANTS = {
  // Auth Use Cases
  DeleteRepliesOnCommentDeleted: Symbol.for("DeleteRepliesOnCommentDeleted"),
  DeleteCommentsOnPostDeleted: Symbol.for("DeleteCommentsOnPostDeleted"),
  NotifyPostAuthorOnPostLiked: Symbol.for("NotifyPostAuthorOnPostLiked"),
  NotifyReceiverOnMessageCreated: Symbol.for("NotifyReceiverOnMessageCreated"),
  NotifyFollowerOnPostCreated: Symbol.for("NotifyFollowerOnPostCreated"),
  NotifyPostAuthorOnCommentCreated: Symbol.for(
    "NotifyPostAuthorOnCommentCreated",
  ),
  SendMessageOnMessageCreated: Symbol.for("SendMessageOnMessageCreated"),
  NotifyCommentAuthorOnCommentCreated: Symbol.for(
    "NotifyCommentAuthorOnCommentCreated",
  ),
  NotifyCommentAuthorOnCommentLiked: Symbol.for(
    "NotifyCommentAuthorOnCommentLiked",
  ),
};

const SERVICE_CONSTANTS = {
  AuthService: Symbol.for("AuthService"),
  FileUploadService: Symbol.for("FileUploadService"),
  MessageService: Symbol.for("MessageService"),
  NotificationService: Symbol.for("NotificationService"),
};

const MIDDLEWARE_CONSTANTS = {
  AuthMiddleware: Symbol.for("AuthMiddleware"),
};

const CONSTANTS = {
  ...REPOSITORY_CONSTANTS,
  ...USE_CASE_CONSTANTS,
  ...SUBSCRIPTION_CONSTANTS,
  ...SERVICE_CONSTANTS,
  ...MIDDLEWARE_CONSTANTS,
};

export default CONSTANTS;
