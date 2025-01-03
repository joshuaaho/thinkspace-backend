import express from "express";
import { notificationController } from "../controllers/index.js";
import { auth, validate } from "../middleware/index.js";
import { notificationValidation } from "../validations/index.js";
const router = express.Router();

router.post(
  "/:notificationId/read",
  auth,
  validate(notificationValidation.markAsRead),
  notificationController.markAsRead
);

export default router;
