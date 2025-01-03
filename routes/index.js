import authRoute from "./auth.routes.js";
import commentRoute from "./comment.routes.js";
import postRoute from "./post.routes.js";
import userRoute from "./user.routes.js";
import chatRoute from "./chat.routes.js";
import messageRoute from "./message.routes.js";
import notificationRoute from "./notification.routes.js";
import { Router } from "express";
const router = Router();
router.use("/auth", authRoute);
router.use("/comments", commentRoute);
router.use("/posts", postRoute);
router.use("/users", userRoute);
router.use("/chats", chatRoute);
router.use("/messages", messageRoute);
router.use("/notifications", notificationRoute);

export default router;
