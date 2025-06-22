import { Container } from "inversify";
import JwtAuthService from "@application/services/JwtAuthService";
import S3FileUploadService from "@application/services/S3FileUploadService";
import SocketIOMessageService from "@application/services/SocketIOMessageService";
import SocketIONotificationService from "@application/services/SocketIONotificationService";

import IAuthService from "@application/services/IAuthService";
import IFileUploadService from "@application/services/IFileUploadService";
import IMessageService from "@application/services/IMessageService";
import INotificationService from "@application/services/INotificationService";
import CONSTANTS from "@containers/constants";

export function bindServices(container: Container) {
  // Services
  container.bind<IAuthService>(CONSTANTS.AuthService).to(JwtAuthService);
  container
    .bind<IFileUploadService>(CONSTANTS.FileUploadService)
    .to(S3FileUploadService);
  container
    .bind<IMessageService>(CONSTANTS.MessageService)
    .to(SocketIOMessageService);
  container
    .bind<INotificationService>(CONSTANTS.NotificationService)
    .to(SocketIONotificationService);
}

