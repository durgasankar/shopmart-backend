import { NextFunction, Request, Response } from "express";

export const validateRegister = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { firstName, email, mobileNumber, password } = req.body;
    if (!firstName) {
        res.status(400).json({ message: "firstName is required" });
        return;
    }
    if (!email) {
        res.status(400).json({ message: "email is required" });
        return;
    }
    if (!mobileNumber) {
        res.status(400).json({ message: "mobileNumber is required" });
        return;
    }
    if (!password) {
        res.status(400).json({ message: "password is required" });
        return;
    }
    next();
};