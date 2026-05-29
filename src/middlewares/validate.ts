import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "../utils/response-handler";

export const validateRegisterRequest = (req: Request, res: Response, next: NextFunction) => {
    const { firstName, email, mobileNumber, password } = req.body;
    if (!firstName || !email || !mobileNumber || !password) {
        return ResponseHandler.error(res, 'All fields are mandatory');
    }
    next();
};

export const validateLoginRequest = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return ResponseHandler.error(res, 'All fields are mandatory');
    }
    if (!isValidEmailAddress(email)) {
        return ResponseHandler.error(res, 'Invalid Email format.');
    }
    next();
}

export const validateAddProductRequest = (req: Request, res: Response, next: NextFunction) => {
    const { name, category, price, quantity } = req.body;
    if (!name || !category || !price || !category) {
        return ResponseHandler.error(res, 'All fields are mandatory.');
    }
    if (isNaN(price) || price < 0) {
        return ResponseHandler.error(res, 'Price must be a positive number.');
    }
    if (isNaN(quantity) || quantity < 1) {
        return ResponseHandler.error(res, 'Quantity must be a valid positive integer.');
    }
    next();
}

const isValidEmailAddress = (email: string): boolean => /^\S+@\S+\.\S+$/.test(email);