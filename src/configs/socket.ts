import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { logger } from "./winston-logger";

let io: Server;

export const initSocket = (server: HTTPServer): Server => {
    io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {
        logger.warn("Socket connected: " + socket.id)
        socket.on("join", (userId: string) => {
            socket.join(userId);
            logger.info(`User joined room: ${userId}`)
        });
        socket.on("disconnect", () => {
            logger.error("Socket disconnected:", socket.id)
        });
    });
    return io;
};

// helper to use anywhere
export const getIo = (): Server => {
    if (!io) {
        throw new Error("Socket not initialized");
    }
    return io;
};