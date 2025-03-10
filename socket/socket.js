// // import { Server } from 'socket.io';
// // import http from 'http';
// // import express from 'express';
// // import tokenService from '#services/token.service';
// const app = express();

// // const server = http.createServer(app);
// // const io = new Server(server, {
// //   cors: {
// //     origin: [process.env.FRONTEND_SERVER],
// //     methods: ['GET', 'POST'],
// //   },
// // });

// // server.listen(process.env.SOCKET_PORT);
// export const getReceiverSocketId = (receiverId) => {
//   return userSocketMap[receiverId];
// };

// const userSocketMap = {};

// io.use(async (socket, next) => {
//   try {
//     const token = socket.handshake.auth.accessToken;

//     const user = await tokenService.verifyAccessToken(token);

//     socket.userId = user._id;
//     next();
//   } catch (err) {
//     if (process.env.NODE_ENV == 'development') {
//       next(err.stack);
//     } else {
//       next('Problem With Connecting To The Chat Server. Please Wait Or Try Again');
//     }
//   }
// });
// io.on('connection', (socket) => {
//   if (socket.userId != 'undefined') userSocketMap[socket.userId] = socket.id;
//   io.emit('getOnlineUsers', Object.keys(userSocketMap));

//   socket.on('disconnect', () => {
//     delete userSocketMap[socket.userId];
//     io.emit('getOnlineUsers', Object.keys(userSocketMap));
//   });
// });
// export { app, io, server };
