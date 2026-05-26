import { Request, Response } from "express";
import { UserServices } from "../services/User";

export class UserController {
    private userService: UserServices;
    constructor() {
        this.userService = new UserServices();
    }
    public registerUserController = async (req: Request, res: Response): Promise<void> => {
        const newUser = req.body;
        await this.userService.registerNewUser(newUser);
        res.status(201).json({ message: 'Registration successful.', data: req.body });
    }
}