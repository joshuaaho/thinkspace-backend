import container from "@containers/index";
import { Router } from "express";
import CONSTANTS from "@containers/constants";
import { AuthMiddleware } from "@presentation/middleware/auth";
    import CreateFileUploadUrlController from "@presentation/controllers/files/createFileUploadUrl";

const router = Router();

const authMiddleware = container.get<AuthMiddleware>(CONSTANTS.AuthMiddleware);

const createFileUploadUrlController = container.get<CreateFileUploadUrlController>(
  CONSTANTS.CreateFileUploadUrlController
);

router.post(
  "/upload-url",
  authMiddleware.authenticate,
  createFileUploadUrlController.handleCreateFileUploadUrl.bind(createFileUploadUrlController)
);

export default router; 