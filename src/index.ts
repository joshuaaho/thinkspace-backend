import express from "express";
import { initializeSubscriptions } from "@application/subscriptions/initializeSubscriptions";
import cors from "cors";
import { createServer } from "http";

import startSocketServer from "@infrastructure/socket";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { RegisterRoutes } from "./routesBuild/routes";
import { ValidationService } from "tsoa";
import errorHandler from "@presentation/middleware/errorHandler";
const PORT = process.env.BACKEND_SERVER_PORT || 4000;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_SERVER,
  })
);

const httpServer = createServer(app);

app.use(express.json());
app.use(cookieParser());

ValidationService.prototype.ValidateParam = (
  property,
  rawValue,
  name = "",
  fieldErrors,
  parent,
  minimalSwaggerConfig
) => rawValue;

RegisterRoutes.prototype.getValidatedArgs = (
  args: any,
  request: any,
  response: any
) => Object.keys(args);

RegisterRoutes(app);

initializeSubscriptions();
startSocketServer(httpServer);

app.use((req, res, next) => {
  res.status(408).send("Unknown Route");
});

app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log("Listening to: ", PORT);
});

export default app;
