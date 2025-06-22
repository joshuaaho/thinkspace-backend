import { Container } from "inversify";
import { AuthMiddleware } from "@presentation/middleware/auth";
import CONSTANTS from "@containers/constants";

export function bindMiddleware(container: Container) {
  // Middleware
  container.bind<AuthMiddleware>(CONSTANTS.AuthMiddleware).to(AuthMiddleware);
} 