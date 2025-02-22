import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/index.js";
import cors from "cors";
import routes from "./routes/index.js";
import AppError from "./classes/AppError.js";
const app = express();

app.listen(process.env.EXPRESS_PORT, () => {
  console.log(`Example app listening on port ${process.env.EXPRESS_PORT}`);
});

app.use(cors({ origin: process.env.APP_SERVER, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(routes);

app.use((req, res, next) => {
  next(new AppError("Unknown Request", 404));
});

app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(`Error connecting to MongoDB: ${err} `);
  });
