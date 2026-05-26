import { NextFunction, Request, Response } from "express";
import winston from "winston";

const { combine, timestamp, printf, colorize, errors } = winston.format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
});

export const logger = winston.createLogger({
    level: "info",

    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }), // logs stack trace
        logFormat
    ),

    transports: [
        // logging at console
        new winston.transports.Console({
            format: combine(colorize(), logFormat),
        }),

        // logging 
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),

        // File logging (all logs)
        new winston.transports.File({
            filename: "logs/combined.log",
        }),
    ],
});
