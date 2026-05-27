import { Request, Response } from "express";
import { UniqueConstraintError } from "sequelize";
import { UserServices } from "../services/User";
import { logger } from "../configs/winston-logger";

export class UserController {
    private userService: UserServices;

    constructor() {
        this.userService = new UserServices();
    }
    public registerUserController = async (req: Request, res: Response): Promise<void> => {
        try {
            const newUser = req.body;
            const createdUser = await this.userService.registerNewUser(newUser);
            res.status(201).json({ message: 'Registration successful.', data: createdUser });
        } catch (error: any) {
            logger.error(`Registration Error: ${error.message}`);
            res.status(400).json({ success: false, message: error.message });
        }
    }
}