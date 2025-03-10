import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import errorHandler from '#middleware/error';
import http from 'http';
import morganMiddleware from '#middleware/morgan';
import cors from 'cors';
import routes from '#routes/index';
import AppError from '#classes/AppError';
import logger from '#utils/logger';
import tokenService from '#services/token.service';
import { v4 as uuidv4 } from 'uuid';
import { socketIOFactory, socketIOSingleton } from '#socket/socket-factory';

const userSocketMap = {};

const app = express();

const server = http.createServer(app);

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_SERVER == "true" ? true :process.env.FRONTEND_SERVER,
  }),
);

socketIOFactory(server)
app.use(express.json());
app.use(cookieParser());
app.use(morganMiddleware);

app.use((req, res, next) => {
  logger.addDefaultMetadata({
    requestId: uuidv4(),
    userId: 'anonymous',
  });
  next();
});

app.use(routes);

app.use((req, res, next) => {
  return next(new AppError('Unknown Request', 404));
});

app.use(errorHandler);

  
  socketIOSingleton.use(async (socket, next) => {
    try {

      const token = socket.handshake.auth.accessToken;
  
      const user = await tokenService.verifyAccessToken(token);
  
      socket.userId = user._id;
      next();
    } catch (err) {
      next(err)
    }
  });
  socketIOSingleton.on('connection', (socket) => {

    if (socket.userId != 'undefined') {

      userSocketMap[socket.userId] = socket.id;

    }
    socketIOSingleton.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
      delete userSocketMap[socket.userId];
      socketIOSingleton.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
  });



mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to db');
  })
  .catch((err) => {
    console.log(`Error connecting to MongoDB: ${err} `);
  });


server.listen(process.env.EXPRESS_PORT, () => {
  console.log(`Example app listening on port ${process.env.EXPRESS_PORT}`);
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};


