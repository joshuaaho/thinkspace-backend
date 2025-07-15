import express from "express";
import { initializeSubscriptions } from "@application/subscriptions/initializeSubscriptions";
import cors from "cors";
import { createServer } from "http";
import startSocketServer from "@infrastructure/socket";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { RegisterRoutes } from "@presentation/routesBuild/routes";
import { ValidationService } from "tsoa";
import errorHandler from "@presentation/middleware/errorHandler";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@utils/logger";
import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";
import morgan from "morgan";
const PORT = process.env.BACKEND_SERVER_PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_SERVER,
  }),
);

const httpServer = createServer(app);

app.use(express.json());
app.use(cookieParser());

app.use((req: any, res: ExpressResponse, next) => {
  req.requestId = uuidv4();
  req.logger = logger.child({ requestId: req.requestId });
  next();
});

app.use((req: any, res: ExpressResponse, next) => {
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: {
      write: (message: any) => {
        req.logger.http(message.trim());
      },
    },
  })(req, res, next);
});

// Disable tsoa built in validation.
ValidationService.prototype.ValidateParam = (
  _property,
  rawValue,
  _name = "",
  _fieldErrors,
  _parent,
  _minimalSwaggerConfig,
) => rawValue;

RegisterRoutes.prototype.getValidatedArgs = (
  args: any,
  _request: any,
  _response: any,
) => Object.keys(args);

app.use(
  "/docs",
  swaggerUi.serve,
  async (_req: ExpressRequest, res: ExpressResponse) => {
    try {
      const swaggerPath = path.join(__dirname, "./docs/swagger.json");

      const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, "utf8"));
      return res.send(swaggerUi.generateHTML(swaggerDocument));
    } catch (_error) {
      return res.status(500).send("Error loading API documentation");
    }
  },
);

RegisterRoutes(app);

initializeSubscriptions();
startSocketServer(httpServer);

app.use(errorHandler);

app.use((_req, res, _next) => {
  return res.status(408).send({ error: "Unknown Route" });
});

httpServer.listen(PORT, () => {
  console.log("Listening to: ", PORT);
});

export default app;
