/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from "@tsoa/runtime";
import { fetchMiddlewares, ExpressTemplateService } from "@tsoa/runtime";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GetByIdController } from "./../controllers/users/getById";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GetMeController } from "./../controllers/users/getMe";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EditUserController } from "./../controllers/users/edit";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FollowController } from "./../controllers/users/follow";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { QueryUsersController } from "./../controllers/users/query";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { QueryNotificationsController } from "./../controllers/notifications/query";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GetUnreadCountController } from "./../controllers/notifications/getUnreadCount";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MarkAsReadController } from "./../controllers/notifications/markAsRead";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CreatePostController } from "./../controllers/posts/create";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DeletePostController } from "./../controllers/posts/delete";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EditPostController } from "./../controllers/posts/edit";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GetPostByIdController } from "./../controllers/posts/getById";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LikePostController } from "./../controllers/posts/like";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UnlikePostController } from "./../controllers/posts/unlike";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { QueryPostController } from "./../controllers/posts/query";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CreateCommentController } from "./../controllers/comments/create";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DeleteCommentController } from "./../controllers/comments/delete";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EditCommentController } from "./../controllers/comments/edit";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LikeCommentController } from "./../controllers/comments/like";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UnlikeCommentController } from "./../controllers/comments/unlike";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { QueryCommentsController } from "./../controllers/comments/query";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { QueryMessagesController } from "./../controllers/messages/query";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { GetChatListController } from "./../controllers/messages/getChatList";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CreateMessageController } from "./../controllers/messages/create";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CreateFileUploadUrlController } from "./../controllers/files/createFileUploadUrl";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LoginController } from "./../controllers/auth/login";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RegisterController } from "./../controllers/auth/register";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LogoutController } from "./../controllers/auth/logout";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RefreshController } from "./../controllers/auth/refresh";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UnfollowController } from "./../controllers/users/unfollow";
import { expressAuthentication } from "./../middleware/auth";
// @ts-ignore - no great way to install types from subpackage
import { iocContainer } from "./../../containers/index";
import type { IocContainer, IocContainerFactory } from "@tsoa/runtime";
import type {
  Request as ExRequest,
  Response as ExResponse,
  RequestHandler,
  Router,
} from "express";

const expressAuthenticationRecasted = expressAuthentication as (
  req: ExRequest,
  securityName: string,
  scopes?: string[],
  res?: ExResponse,
) => Promise<any>;

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  ThemePreference: {
    dataType: "refAlias",
    type: {
      dataType: "union",
      subSchemas: [
        { dataType: "enum", enums: ["light"] },
        { dataType: "enum", enums: ["dark"] },
        { dataType: "enum", enums: ["system"] },
      ],
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  GetUserByIdResponse: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        followedBy: {
          dataType: "array",
          array: { dataType: "string" },
          required: true,
        },
        themePreference: { ref: "ThemePreference", required: true },
        profileImgUrl: { dataType: "string", required: true },
        location: { dataType: "string" },
        interest: { dataType: "string" },
        education: { dataType: "string" },
        bio: { dataType: "string" },
        work: { dataType: "string" },
        email: { dataType: "string", required: true },
        username: { dataType: "string", required: true },
        id: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  HTTPError: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: { error: { dataType: "string", required: true } },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  GetMeResponse: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        followedBy: {
          dataType: "array",
          array: { dataType: "string" },
          required: true,
        },
        themePreference: { ref: "ThemePreference", required: true },
        profileImgUrl: { dataType: "string", required: true },
        location: { dataType: "string" },
        interest: { dataType: "string" },
        education: { dataType: "string" },
        bio: { dataType: "string" },
        work: { dataType: "string" },
        email: { dataType: "string", required: true },
        username: { dataType: "string", required: true },
        id: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  "Partial__work-string--bio-string--education-string--interest-string--location-string--profileImgUrl_description-S3urloftheprofileimage.Generateapresignedurlusing_47_files_47_upload-urlandusetheurltosavetheimagetos3_40_Automaticallyhandledbythefrontend_41_.Aftersaving.theurlcanbeusedinthisrequesttoindicateyournewprofileimage_-string--themePreference-ThemePreference__":
    {
      dataType: "refAlias",
      type: {
        dataType: "nestedObjectLiteral",
        nestedProperties: {
          work: { dataType: "string" },
          bio: { dataType: "string" },
          education: { dataType: "string" },
          interest: { dataType: "string" },
          location: { dataType: "string" },
          profileImgUrl: { dataType: "string" },
          themePreference: { ref: "ThemePreference" },
        },
        validators: {},
      },
    },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  EditUserCommand: {
    dataType: "refAlias",
    type: {
      ref: "Partial__work-string--bio-string--education-string--interest-string--location-string--profileImgUrl_description-S3urloftheprofileimage.Generateapresignedurlusing_47_files_47_upload-urlandusetheurltosavetheimagetos3_40_Automaticallyhandledbythefrontend_41_.Aftersaving.theurlcanbeusedinthisrequesttoindicateyournewprofileimage_-string--themePreference-ThemePreference__",
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  QueryUsersResponse: {
    dataType: "refAlias",
    type: {
      dataType: "array",
      array: {
        dataType: "nestedObjectLiteral",
        nestedProperties: {
          followedBy: {
            dataType: "array",
            array: { dataType: "string" },
            required: true,
          },
          themePreference: { ref: "ThemePreference", required: true },
          profileImgUrl: { dataType: "string", required: true },
          location: { dataType: "string" },
          interest: { dataType: "string" },
          education: { dataType: "string" },
          bio: { dataType: "string" },
          work: { dataType: "string" },
          email: { dataType: "string", required: true },
          username: { dataType: "string", required: true },
          id: { dataType: "string", required: true },
        },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  QueryUsersCommand: {
    dataType: "refObject",
    properties: {
      offset: { dataType: "double" },
      limit: { dataType: "double" },
      username: { dataType: "string" },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  QueryNotificationsResponse: {
    dataType: "refAlias",
    type: {
      dataType: "array",
      array: {
        dataType: "nestedObjectLiteral",
        nestedProperties: {
          createdAt: { dataType: "string", required: true },
          redirectToResourceType: { dataType: "string", required: true },
          resourceId: { dataType: "string", required: true },
          isRead: { dataType: "boolean", required: true },
          message: { dataType: "string", required: true },
          fromProfileImgUrl: { dataType: "string", required: true },
          id: { dataType: "string", required: true },
        },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  QueryNotificationsCommand: {
    dataType: "refObject",
    properties: {
      offset: { dataType: "double" },
      limit: { dataType: "double" },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  GetUnreadCountResponse: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: { unreadCount: { dataType: "double", required: true } },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  MarkAsReadCommand: {
    dataType: "refObject",
    properties: {
      redirectToResourceType: { dataType: "string" },
      resourceId: { dataType: "string" },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CreatePostResponse: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: { postId: { dataType: "string", required: true } },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CreatePostCommand: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        tags: { dataType: "array", array: { dataType: "string" } },
        content: { dataType: "string", required: true },
        imgUrls: { dataType: "array", array: { dataType: "string" } },
        title: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  EditPostUpdates: {
    dataType: "refObject",
    properties: {
      title: { dataType: "string" },
      content: { dataType: "string" },
      tags: { dataType: "array", array: { dataType: "string" } },
      imgUrls: { dataType: "array", array: { dataType: "string" } },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  GetPostByIdResponse: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        commentedBy: {
          dataType: "array",
          array: { dataType: "string" },
          required: true,
        },
        likedBy: {
          dataType: "array",
          array: { dataType: "string" },
          required: true,
        },
        createdAt: { dataType: "datetime", required: true },
        imgUrls: {
          dataType: "array",
          array: { dataType: "string" },
          required: true,
        },
        tags: {
          dataType: "array",
          array: { dataType: "string" },
          required: true,
        },
        authorProfileImgUrl: { dataType: "string", required: true },
        username: { dataType: "string", required: true },
        authorId: { dataType: "string", required: true },
        content: { dataType: "string", required: true },
        title: { dataType: "string", required: true },
        id: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  QueryPostsResponse: {
    dataType: "refAlias",
    type: {
      dataType: "array",
      array: {
        dataType: "nestedObjectLiteral",
        nestedProperties: {
          commentedBy: {
            dataType: "array",
            array: { dataType: "string" },
            required: true,
          },
          imgUrls: {
            dataType: "array",
            array: { dataType: "string" },
            required: true,
          },
          likedBy: {
            dataType: "array",
            array: { dataType: "string" },
            required: true,
          },
          tags: {
            dataType: "array",
            array: { dataType: "string" },
            required: true,
          },
          createdAt: { dataType: "string", required: true },
          content: { dataType: "string", required: true },
          title: { dataType: "string", required: true },
          id: { dataType: "string", required: true },
          authorProfileImgUrl: { dataType: "string", required: true },
          username: { dataType: "string", required: true },
          authorId: { dataType: "string", required: true },
        },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  SortBy: {
    dataType: "refAlias",
    type: {
      dataType: "union",
      subSchemas: [
        { dataType: "enum", enums: ["newest"] },
        { dataType: "enum", enums: ["oldest"] },
        { dataType: "enum", enums: ["mostLiked"] },
      ],
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  QueryPostsCommand: {
    dataType: "refObject",
    properties: {
      offset: { dataType: "double" },
      limit: { dataType: "double" },
      tags: { dataType: "array", array: { dataType: "string" } },
      sortBy: { ref: "SortBy" },
      title: { dataType: "string" },
      authorId: { dataType: "string" },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CreateCommentCommand: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        postId: { dataType: "string", required: true },
        parentCommentId: { dataType: "string" },
        content: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  EditCommentBody: {
    dataType: "refObject",
    properties: {
      content: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  QueryCommentsResponse: {
    dataType: "refAlias",
    type: {
      dataType: "array",
      array: {
        dataType: "nestedObjectLiteral",
        nestedProperties: {
          parentCommentId: { dataType: "string" },
          likedBy: {
            dataType: "array",
            array: { dataType: "string" },
            required: true,
          },
          createdAt: { dataType: "string", required: true },
          authorProfileImgUrl: { dataType: "string", required: true },
          authorUsername: { dataType: "string", required: true },
          authorId: { dataType: "string", required: true },
          postId: { dataType: "string", required: true },
          content: { dataType: "string", required: true },
          id: { dataType: "string", required: true },
        },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  QueryCommentsCommand: {
    dataType: "refObject",
    properties: {
      postId: { dataType: "string" },
      offset: { dataType: "double" },
      limit: { dataType: "double" },
      authorId: { dataType: "string" },
      sortBy: { ref: "SortBy" },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  QueryMessagesResponse: {
    dataType: "refAlias",
    type: {
      dataType: "array",
      array: {
        dataType: "nestedObjectLiteral",
        nestedProperties: {
          isFromCurrentUser: { dataType: "boolean", required: true },
          otherParticipantId: { dataType: "string", required: true },
          createdAt: { dataType: "string", required: true },
          content: { dataType: "string", required: true },
          username: { dataType: "string", required: true },
          profileImgUrl: { dataType: "string", required: true },
          id: { dataType: "string", required: true },
        },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  QueryMessagesCommand: {
    dataType: "refObject",
    properties: {
      otherParticipantId: { dataType: "string", required: true },
      offset: { dataType: "double" },
      limit: { dataType: "double" },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  GetChatListResponse: {
    dataType: "refAlias",
    type: {
      dataType: "array",
      array: {
        dataType: "nestedObjectLiteral",
        nestedProperties: {
          otherParticipantId: { dataType: "string", required: true },
          createdAt: { dataType: "string", required: true },
          content: { dataType: "string", required: true },
          profileImgUrl: { dataType: "string", required: true },
          otherParticipantUsername: { dataType: "string", required: true },
          id: { dataType: "string", required: true },
        },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CreateMessageCommand: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        recipientId: { dataType: "string", required: true },
        text: { dataType: "string", required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CreateFileUploadUrlResponse: {
    dataType: "refAlias",
    type: {
      dataType: "nestedObjectLiteral",
      nestedProperties: { uploadUrl: { dataType: "string", required: true } },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  LoginCommand: {
    dataType: "refObject",
    properties: {
      username: { dataType: "string", required: true },
      password: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  RegisterCommand: {
    dataType: "refObject",
    properties: {
      username: { dataType: "string", required: true },
      password: { dataType: "string", required: true },
      email: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {
  noImplicitAdditionalProperties: "throw-on-extras",
  bodyCoercion: true,
});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################

  const argsGetByIdController_handleGetById: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    userId: { in: "path", name: "userId", required: true, dataType: "string" },
  };
  app.get(
    "/users/:userId",
    ...fetchMiddlewares<RequestHandler>(GetByIdController),
    ...fetchMiddlewares<RequestHandler>(
      GetByIdController.prototype.handleGetById,
    ),

    async function GetByIdController_handleGetById(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsGetByIdController_handleGetById,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<GetByIdController>(GetByIdController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "handleGetById",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsGetMeController_handleGetMe: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.get(
    "/me",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(GetMeController),
    ...fetchMiddlewares<RequestHandler>(GetMeController.prototype.handleGetMe),

    async function GetMeController_handleGetMe(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsGetMeController_handleGetMe,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<GetMeController>(GetMeController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "handleGetMe",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsEditUserController_handleEdit: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    body: { in: "body", name: "body", required: true, ref: "EditUserCommand" },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.patch(
    "/users/me",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(EditUserController),
    ...fetchMiddlewares<RequestHandler>(
      EditUserController.prototype.handleEdit,
    ),

    async function EditUserController_handleEdit(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsEditUserController_handleEdit,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<EditUserController>(EditUserController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "handleEdit",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsFollowController_follow: Record<string, TsoaRoute.ParameterSchema> =
    {
      userId: {
        in: "path",
        name: "userId",
        required: true,
        dataType: "string",
      },
      req: { in: "request", name: "req", required: true, dataType: "object" },
    };
  app.post(
    "/users/:userId/follow",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(FollowController),
    ...fetchMiddlewares<RequestHandler>(FollowController.prototype.follow),

    async function FollowController_follow(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsFollowController_follow,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<FollowController>(FollowController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "follow",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsQueryUsersController_queryUsers: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    query: {
      in: "queries",
      name: "query",
      required: true,
      ref: "QueryUsersCommand",
    },
  };
  app.get(
    "/users",
    ...fetchMiddlewares<RequestHandler>(QueryUsersController),
    ...fetchMiddlewares<RequestHandler>(
      QueryUsersController.prototype.queryUsers,
    ),

    async function QueryUsersController_queryUsers(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsQueryUsersController_queryUsers,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<QueryUsersController>(QueryUsersController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "queryUsers",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsQueryNotificationsController_handleQuery: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    query: {
      in: "queries",
      name: "query",
      required: true,
      ref: "QueryNotificationsCommand",
    },
  };
  app.get(
    "/notifications/me",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(QueryNotificationsController),
    ...fetchMiddlewares<RequestHandler>(
      QueryNotificationsController.prototype.handleQuery,
    ),

    async function QueryNotificationsController_handleQuery(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsQueryNotificationsController_handleQuery,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<QueryNotificationsController>(
            QueryNotificationsController,
          );
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "handleQuery",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsGetUnreadCountController_handleGetUnreadCount: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.get(
    "/notifications/unread-count",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(GetUnreadCountController),
    ...fetchMiddlewares<RequestHandler>(
      GetUnreadCountController.prototype.handleGetUnreadCount,
    ),

    async function GetUnreadCountController_handleGetUnreadCount(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsGetUnreadCountController_handleGetUnreadCount,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any = await container.get<GetUnreadCountController>(
          GetUnreadCountController,
        );
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "handleGetUnreadCount",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsMarkAsReadController_handleMarkAsRead: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    body: {
      in: "body",
      name: "body",
      required: true,
      ref: "MarkAsReadCommand",
    },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.post(
    "/notifications/read",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(MarkAsReadController),
    ...fetchMiddlewares<RequestHandler>(
      MarkAsReadController.prototype.handleMarkAsRead,
    ),

    async function MarkAsReadController_handleMarkAsRead(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsMarkAsReadController_handleMarkAsRead,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<MarkAsReadController>(MarkAsReadController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "handleMarkAsRead",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCreatePostController_createPost: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    body: {
      in: "body",
      name: "body",
      required: true,
      ref: "CreatePostCommand",
    },
  };
  app.post(
    "/posts",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(CreatePostController),
    ...fetchMiddlewares<RequestHandler>(
      CreatePostController.prototype.createPost,
    ),

    async function CreatePostController_createPost(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCreatePostController_createPost,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<CreatePostController>(CreatePostController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "createPost",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsDeletePostController_deletePost: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    postId: { in: "path", name: "postId", required: true, dataType: "string" },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.delete(
    "/posts/:postId",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(DeletePostController),
    ...fetchMiddlewares<RequestHandler>(
      DeletePostController.prototype.deletePost,
    ),

    async function DeletePostController_deletePost(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsDeletePostController_deletePost,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<DeletePostController>(DeletePostController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "deletePost",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 204,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsEditPostController_editPost: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    postId: { in: "path", name: "postId", required: true, dataType: "string" },
    updates: {
      in: "body",
      name: "updates",
      required: true,
      ref: "EditPostUpdates",
    },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.patch(
    "/posts/:postId",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(EditPostController),
    ...fetchMiddlewares<RequestHandler>(EditPostController.prototype.editPost),

    async function EditPostController_editPost(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsEditPostController_editPost,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<EditPostController>(EditPostController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "editPost",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsGetPostByIdController_getPostById: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    postId: { in: "path", name: "postId", required: true, dataType: "string" },
  };
  app.get(
    "/posts/:postId",
    ...fetchMiddlewares<RequestHandler>(GetPostByIdController),
    ...fetchMiddlewares<RequestHandler>(
      GetPostByIdController.prototype.getPostById,
    ),

    async function GetPostByIdController_getPostById(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsGetPostByIdController_getPostById,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any = await container.get<GetPostByIdController>(
          GetPostByIdController,
        );
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "getPostById",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsLikePostController_likePost: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    postId: { in: "path", name: "postId", required: true, dataType: "string" },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.post(
    "/posts/:postId/like",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(LikePostController),
    ...fetchMiddlewares<RequestHandler>(LikePostController.prototype.likePost),

    async function LikePostController_likePost(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsLikePostController_likePost,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<LikePostController>(LikePostController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "likePost",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUnlikePostController_unlikePost: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    postId: { in: "path", name: "postId", required: true, dataType: "string" },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.post(
    "/posts/:postId/unlike",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(UnlikePostController),
    ...fetchMiddlewares<RequestHandler>(
      UnlikePostController.prototype.unlikePost,
    ),

    async function UnlikePostController_unlikePost(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUnlikePostController_unlikePost,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<UnlikePostController>(UnlikePostController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "unlikePost",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsQueryPostController_queryPosts: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    query: {
      in: "queries",
      name: "query",
      required: true,
      ref: "QueryPostsCommand",
    },
  };
  app.get(
    "/posts",
    ...fetchMiddlewares<RequestHandler>(QueryPostController),
    ...fetchMiddlewares<RequestHandler>(
      QueryPostController.prototype.queryPosts,
    ),

    async function QueryPostController_queryPosts(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsQueryPostController_queryPosts,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<QueryPostController>(QueryPostController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "queryPosts",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCreateCommentController_create: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    body: {
      in: "body",
      name: "body",
      required: true,
      ref: "CreateCommentCommand",
    },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.post(
    "/comments",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(CreateCommentController),
    ...fetchMiddlewares<RequestHandler>(
      CreateCommentController.prototype.create,
    ),

    async function CreateCommentController_create(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCreateCommentController_create,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any = await container.get<CreateCommentController>(
          CreateCommentController,
        );
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "create",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsDeleteCommentController_delete: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    commentId: {
      in: "path",
      name: "commentId",
      required: true,
      dataType: "string",
    },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.delete(
    "/comments/:commentId",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(DeleteCommentController),
    ...fetchMiddlewares<RequestHandler>(
      DeleteCommentController.prototype.delete,
    ),

    async function DeleteCommentController_delete(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsDeleteCommentController_delete,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any = await container.get<DeleteCommentController>(
          DeleteCommentController,
        );
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "delete",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 204,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsEditCommentController_edit: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    commentId: {
      in: "path",
      name: "commentId",
      required: true,
      dataType: "string",
    },
    body: { in: "body", name: "body", required: true, ref: "EditCommentBody" },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.patch(
    "/comments/:commentId",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(EditCommentController),
    ...fetchMiddlewares<RequestHandler>(EditCommentController.prototype.edit),

    async function EditCommentController_edit(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsEditCommentController_edit,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any = await container.get<EditCommentController>(
          EditCommentController,
        );
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "edit",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsLikeCommentController_like: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    commentId: {
      in: "path",
      name: "commentId",
      required: true,
      dataType: "string",
    },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.post(
    "/comments/:commentId/like",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(LikeCommentController),
    ...fetchMiddlewares<RequestHandler>(LikeCommentController.prototype.like),

    async function LikeCommentController_like(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsLikeCommentController_like,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any = await container.get<LikeCommentController>(
          LikeCommentController,
        );
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "like",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUnlikeCommentController_unlike: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    commentId: {
      in: "path",
      name: "commentId",
      required: true,
      dataType: "string",
    },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.post(
    "/comments/:commentId/unlike",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(UnlikeCommentController),
    ...fetchMiddlewares<RequestHandler>(
      UnlikeCommentController.prototype.unlike,
    ),

    async function UnlikeCommentController_unlike(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUnlikeCommentController_unlike,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any = await container.get<UnlikeCommentController>(
          UnlikeCommentController,
        );
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "unlike",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsQueryCommentsController_query: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    query: {
      in: "queries",
      name: "query",
      required: true,
      ref: "QueryCommentsCommand",
    },
  };
  app.get(
    "/comments",
    ...fetchMiddlewares<RequestHandler>(QueryCommentsController),
    ...fetchMiddlewares<RequestHandler>(
      QueryCommentsController.prototype.query,
    ),

    async function QueryCommentsController_query(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsQueryCommentsController_query,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any = await container.get<QueryCommentsController>(
          QueryCommentsController,
        );
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "query",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsQueryMessagesController_queryMessages: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    query: {
      in: "queries",
      name: "query",
      required: true,
      ref: "QueryMessagesCommand",
    },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.get(
    "/messages",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(QueryMessagesController),
    ...fetchMiddlewares<RequestHandler>(
      QueryMessagesController.prototype.queryMessages,
    ),

    async function QueryMessagesController_queryMessages(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsQueryMessagesController_queryMessages,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any = await container.get<QueryMessagesController>(
          QueryMessagesController,
        );
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "queryMessages",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsGetChatListController_getChatList: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.get(
    "/chats",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(GetChatListController),
    ...fetchMiddlewares<RequestHandler>(
      GetChatListController.prototype.getChatList,
    ),

    async function GetChatListController_getChatList(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsGetChatListController_getChatList,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any = await container.get<GetChatListController>(
          GetChatListController,
        );
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "getChatList",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCreateMessageController_createMessage: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    body: {
      in: "body",
      name: "body",
      required: true,
      ref: "CreateMessageCommand",
    },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.post(
    "/messages",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(CreateMessageController),
    ...fetchMiddlewares<RequestHandler>(
      CreateMessageController.prototype.createMessage,
    ),

    async function CreateMessageController_createMessage(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCreateMessageController_createMessage,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any = await container.get<CreateMessageController>(
          CreateMessageController,
        );
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "createMessage",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCreateFileUploadUrlController_handleCreateFileUploadUrl: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {};
  app.post(
    "/files/upload-url",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(CreateFileUploadUrlController),
    ...fetchMiddlewares<RequestHandler>(
      CreateFileUploadUrlController.prototype.handleCreateFileUploadUrl,
    ),

    async function CreateFileUploadUrlController_handleCreateFileUploadUrl(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCreateFileUploadUrlController_handleCreateFileUploadUrl,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<CreateFileUploadUrlController>(
            CreateFileUploadUrlController,
          );
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "handleCreateFileUploadUrl",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsLoginController_login: Record<string, TsoaRoute.ParameterSchema> = {
    body: { in: "body", name: "body", required: true, ref: "LoginCommand" },
  };
  app.post(
    "/auth/login",
    ...fetchMiddlewares<RequestHandler>(LoginController),
    ...fetchMiddlewares<RequestHandler>(LoginController.prototype.login),

    async function LoginController_login(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsLoginController_login,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<LoginController>(LoginController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "login",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsRegisterController_register: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    body: { in: "body", name: "body", required: true, ref: "RegisterCommand" },
  };
  app.post(
    "/auth/register",
    ...fetchMiddlewares<RequestHandler>(RegisterController),
    ...fetchMiddlewares<RequestHandler>(RegisterController.prototype.register),

    async function RegisterController_register(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsRegisterController_register,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<RegisterController>(RegisterController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "register",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsLogoutController_logout: Record<string, TsoaRoute.ParameterSchema> =
    {
      req: { in: "request", name: "req", required: true, dataType: "object" },
    };
  app.post(
    "/auth/logout",
    ...fetchMiddlewares<RequestHandler>(LogoutController),
    ...fetchMiddlewares<RequestHandler>(LogoutController.prototype.logout),

    async function LogoutController_logout(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsLogoutController_logout,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<LogoutController>(LogoutController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "logout",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsRefreshController_refresh: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.post(
    "/auth/refresh",
    ...fetchMiddlewares<RequestHandler>(RefreshController),
    ...fetchMiddlewares<RequestHandler>(RefreshController.prototype.refresh),

    async function RefreshController_refresh(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsRefreshController_refresh,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<RefreshController>(RefreshController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "refresh",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUnfollowController_unfollow: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    userId: { in: "path", name: "userId", required: true, dataType: "string" },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.post(
    "/users/:userId/unfollow",
    authenticateMiddleware([{ bearerAuth: [] }]),
    ...fetchMiddlewares<RequestHandler>(UnfollowController),
    ...fetchMiddlewares<RequestHandler>(UnfollowController.prototype.unfollow),

    async function UnfollowController_unfollow(
      request: ExRequest,
      response: ExResponse,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUnfollowController_unfollow,
          request,
          response,
        });

        const container: IocContainer =
          typeof iocContainer === "function"
            ? (iocContainer as IocContainerFactory)(request)
            : iocContainer;

        const controller: any =
          await container.get<UnfollowController>(UnfollowController);
        if (typeof controller["setStatus"] === "function") {
          controller.setStatus(undefined);
        }

        await templateService.apiHandler({
          methodName: "unfollow",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 200,
        });
      } catch (err) {
        return next(err);
      }
    },
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
    return async function runAuthenticationMiddleware(
      request: any,
      response: any,
      next: any,
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      // keep track of failed auth attempts so we can hand back the most
      // recent one.  This behavior was previously existing so preserving it
      // here
      const failedAttempts: any[] = [];
      const pushAndRethrow = (error: any) => {
        failedAttempts.push(error);
        throw error;
      };

      const secMethodOrPromises: Promise<any>[] = [];
      for (const secMethod of security) {
        if (Object.keys(secMethod).length > 1) {
          const secMethodAndPromises: Promise<any>[] = [];

          for (const name in secMethod) {
            secMethodAndPromises.push(
              expressAuthenticationRecasted(
                request,
                name,
                secMethod[name],
                response,
              ).catch(pushAndRethrow),
            );
          }

          // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

          secMethodOrPromises.push(
            Promise.all(secMethodAndPromises).then((users) => {
              return users[0];
            }),
          );
        } else {
          for (const name in secMethod) {
            secMethodOrPromises.push(
              expressAuthenticationRecasted(
                request,
                name,
                secMethod[name],
                response,
              ).catch(pushAndRethrow),
            );
          }
        }
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      try {
        request["user"] = await Promise.any(secMethodOrPromises);

        // Response was sent in middleware, abort
        if (response.writableEnded) {
          return;
        }

        next();
      } catch (err) {
        // Show most recent error as response
        const error = failedAttempts.pop();
        error.status = error.status || 401;

        // Response was sent in middleware, abort
        if (response.writableEnded) {
          return;
        }
        next(error);
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    };
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
