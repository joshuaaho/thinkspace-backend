import { Router } from "express";
import { validate, auth } from "../middleware/index.js";
import { chatController } from "../controllers/index.js";
import { chatValidation } from "../validations/index.js";
const router = Router();

router.post(
  "/",
  auth,
  validate(chatValidation.createChat),
  chatController.createChat
);

router.get(
  "/",
  auth,
  validate(chatValidation.getChats),
  chatController.getChats
);

export default router;
