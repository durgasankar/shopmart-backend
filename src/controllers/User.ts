import { Request, Response } from "express";
import { UserServices } from "../services/User";
import { logger } from "../configs/winston-logger";
import { BaseController } from "./base-controller";

export class UserController extends BaseController {
    private userService: UserServices;

    constructor() {
        super();
        this.userService = new UserServices();
    }
    public registerUserController = async (req: Request, res: Response) => {
        try {
            const newUser = req.body;
            const createdUser = await this.userService.registerNewUser(newUser);
            return this.created(res, 'Registration successful.', createdUser)
        } catch (error: any) {
            const message: string = `Registration Error: ${error.message}`
            logger.error(message);
            return this.badRequest(res, message);
        }
    }
}