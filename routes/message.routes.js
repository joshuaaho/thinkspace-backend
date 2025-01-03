import { Router } from "express";
import { auth, validate } from "../middleware/index.js";
import { messageController } from "../controllers/index.js";
import { messageValidation } from "../validations/index.js";

const router = Router();

router.post("/", auth, messageController.sendMessage);
router.get(
  "/",
  auth,
  validate(messageValidation.getMessages),
  messageController.getMessages
);

export default router;
