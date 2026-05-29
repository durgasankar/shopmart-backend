import { Response } from "express";

export class ResponseHandler {
    public static success(res: Response, message: string, data: any = null, statusCode = 200) {
        return res.status(statusCode).json({ message, data });
    }

    public static error(res: Response, message: string, statusCode = 400) {
        return res.status(statusCode).json({ message });
    }
}