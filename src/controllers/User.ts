import { NextFunction, Request, Response } from "express";
import { UserServices } from "../services/User";
import { logger } from "../configs/winston-logger";
import { BaseController } from "./base-controller";
import { RegistrationUserResponse } from "../dtos/registration-user";
import { LoginUserResponse } from "../dtos/login-user";

export class UserController extends BaseController {
    private userService: UserServices;

    constructor() {
        super();
        this.userService = new UserServices();
    }
    public registerUserController = async (req: Request, res: Response) => {
        try {
            const newUser = req.body;
            const createdUser: RegistrationUserResponse = await this.userService.registerNewUser(newUser);
            return this.created(res, 'Registration successful.', createdUser)
        } catch (error: any) {
            const message: string = `Registration Error: ${error.message}`
            logger.error(message);
            return this.badRequest(res, message);
        }
    }

    public loginUserController = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const loginUserInfo: LoginUserResponse = await this.userService.loginUser(email, password);
            return this.ok(res, 'Login Sucessful.', loginUserInfo);
        } catch (error: any) {
            const message: string = `Login Error: ${error.message}`
            logger.error(message);
            return this.badRequest(res, message);
        }
    }
}