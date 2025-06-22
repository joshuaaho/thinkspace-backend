import JwtService from "@application/services/JwtAuthService";

import { io as ioc, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ServerToClientEvents } from "@infrastructure/socket";
import "dotenv/config";
export const createAccessToken = (userId: string) => {
  const jwtService = new JwtService();
  const token = jwtService.createAccessToken(userId);
  return token;
};

export const createRefreshToken = (userId: string) => {
  const jwtService = new JwtService();
  const token = jwtService.createRefreshToken(userId);
  return token;
};

export const initializeClientSocket = async (token: string) => {
  return new Promise<Socket<ServerToClientEvents, DefaultEventsMap>>(
    (resolve, reject) => {
      const clientSocket: Socket<ServerToClientEvents, DefaultEventsMap> = ioc(
        process.env.BACKEND_SERVER_URL,
        {
          auth: {
            accessToken: token,
          },
        }
      );

      clientSocket.on("connect", () => resolve(clientSocket));

      clientSocket.on("connect_error", (error) =>
        reject(new Error("Failed to connect to socket: " + error.message))
      );
    }
  );
};
