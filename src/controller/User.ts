import { Request, Response } from "express";

export class UserController {
    constructor() {
        
    }
    public registerUserController = async (req: Request, res: Response): Promise<void> => {
        res.status(201).json({ message: 'Registration successful.', data: req.body });
    }
}