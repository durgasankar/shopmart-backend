import { Response } from "express";

export class ResponseHandler {
    public static success(res: Response, message: string, data: any = null, status = 200) {
        return res.status(status).json({ message, data });
    }

    public static error(res: Response, message: string, status = 400) {
        return res.status(status).json({ message });
    }
}