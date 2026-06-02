import { NextFunction, Request, Response } from "express";
import { logger } from "../configs/winston-logger";

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    let responseBody: any;

    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
        responseBody = body;
        return originalJson(body);
    };

    res.on("finish", () => {
        const duration = Date.now() - start;
        logger.info({
            method: req.method,
            url: req.originalUrl,
            requestBody: req.body,
            // responseBody: responseBody,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
        });
    });

    res.on("close", () => {
        if (!res.writableEnded) {
            logger.warn({
                method: req.method,
                url: req.originalUrl,
                message: "Request closed before response finished",
            });
        }
    });

    next();
}