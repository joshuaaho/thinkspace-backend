import express from "express";
import { userValidation } from "../validations/index.js";
import { auth, validate } from "../middleware/index.js";
import { userController } from "../controllers/index.js";
const router = express.Router();

router.get("/S3Url", auth, userController.getS3Url);

router.get(
  "/:userId",
  validate(userValidation.getUserById),
  userController.getUserById
);

router.get("/", validate(userValidation.queryUsers), userController.queryUsers);
router.get("/", validate(userValidation.queryUsers), userController.queryUsers);

router.post(
  "/:userId/follow",
  auth,
  validate(userValidation.followUserById),
  userController.followUserById
);

router.post(
  "/:userId/unfollow",
  auth,
  validate(userValidation.unfollowUserById),
  userController.unfollowUserById
);

router.get(
  "/:userId/notifications",
  auth,
  validate(userValidation.getUsersNotifications),
  userController.getUsersNotifications
);

export default router;
