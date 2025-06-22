import express from "express";
import { initializeSubscriptions } from "@application/subscriptions/initializeSubscriptions";
import cors from "cors";
import { createServer } from "http";
import routes from "@presentation/routes/router";
import startSocketServer from "@infrastructure/socket";
import "dotenv/config";
import cookieParser from "cookie-parser";
import filesRouter from "@presentation/routes/files/router";
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
app.use((req, res, next) => {
  next();
});
app.use(routes);

app.use((req, res, next) => {
  res.status(408).send("Unknown Route");
});

app.use((err: any, req: any, res: any, next: any) => {
  console.log(err);
  res.status(500).send("Something broke!");
});

initializeSubscriptions();
startSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log("Listening to: ", PORT);
});

export default app;
