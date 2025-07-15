import { Server, DefaultEventsMap } from "socket.io";
import JwtService from "@application/services/JwtAuthService";
import timer from "long-timeout";
import "dotenv/config";
export const userSocketMap: Record<string, string> = {};

interface SocketData {
  userId: string;
}
export interface ServerToClientEvents {
  newNotification: (notification: any) => void;
  newChatMessage: (message: any) => void;
}

export let io: Server<
  DefaultEventsMap,
  ServerToClientEvents,
  DefaultEventsMap,
  SocketData
>;

export default function startSocketServer(httpServer: any) {
  io = new Server<
    DefaultEventsMap,
    ServerToClientEvents,
    DefaultEventsMap,
    SocketData
  >(httpServer, {
    cors: {
      origin: process.env.FRONTEND_SERVER,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.accessToken;
    const jwtService = new JwtService();

    const jwtPayloadOrError = jwtService.verifyAccessToken(token);

    if (jwtPayloadOrError.isErr()) {
      return next(jwtPayloadOrError.error);
    }

    const jwtPayload = jwtPayloadOrError.value;
    const expiresIn = (jwtPayload.exp - Date.now() / 1000) * 1000;
    const timeout = timer.setTimeout(() => socket.disconnect(true), expiresIn);

    socket.data.userId = jwtPayloadOrError.value.userId;

    socket.on("disconnect", () => {
      timer.clearTimeout(timeout);
    });

    next();
  });

  io.on("connection", (socket) => {
    userSocketMap[socket.data.userId] = socket.id;
  });
  io.on("disconnect", (socket) => {
    delete userSocketMap[socket.data.userId];
  });
}
