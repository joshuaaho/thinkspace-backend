import { Server } from 'socket.io';

export let socketIOSingleton = null;

export function socketIOFactory(serverInstance) {
    socketIOSingleton = new Server(serverInstance, {
          cors: {
            origin: process.env.FRONTEND_SERVER == "true" ? true :process.env.FRONTEND_SERVER,
            methods: ['GET', 'POST'],
          },
        })
}