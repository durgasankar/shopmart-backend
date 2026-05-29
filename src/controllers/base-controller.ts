import { Response } from "express";
import { ResponseHandler } from "../utils/response-handler";

export class BaseController {

    public static unauthorized(res: Response, message: string) {
        return ResponseHandler.error(res, message, 401);
    }

    public ok(res: Response, message: string, data?: any) {
        return ResponseHandler.success(res, message, data);
    }

    public created(res: Response, message: string, data?: any) {
        return ResponseHandler.success(res, message, data, 201);
    }

    public badRequest(res: Response, message: string) {
        return ResponseHandler.error(res, message);
    }
}