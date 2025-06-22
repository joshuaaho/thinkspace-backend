import { Router } from "express";
import LoginController from "@presentation/controllers/auth/login";
import RegisterController from "@presentation/controllers/auth/register";
import LogoutController from "@presentation/controllers/auth/logout";
import RefreshController from "@presentation/controllers/auth/refresh";
import CONSTANTS from "@containers/constants";
import container from "@containers/index";

const router = Router();

const loginController = container.get<LoginController>(
  CONSTANTS.LoginController
);
const registerController = container.get<RegisterController>(
  CONSTANTS.RegisterController
);
const logoutController = container.get<LogoutController>(
  CONSTANTS.LogoutController
);
const refreshController = container.get<RefreshController>(
  CONSTANTS.RefreshController
);

router.post("/login", loginController.login.bind(loginController));
router.post("/register", registerController.register.bind(registerController));
router.post("/logout", logoutController.logout.bind(logoutController));
router.post("/refresh", refreshController.refresh.bind(refreshController));

export default router;
