import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { BaseController } from '../controllers/base-controller';

interface AuthRequest extends Request {
    user?: string | JwtPayload;
}

const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        // bearer token missing
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            BaseController.unauthorized(res, 'Unauthorized: Invalid authorization format.');
        }
        // decoding token payload
        const token = authHeader?.split(' ')[1];
        if (!token) {
            BaseController.unauthorized(res, 'Unauthorized: Bearer token missing.');
            return;
        }
        // validating the token 
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    } catch (error) {
        BaseController.unauthorized(res, 'Invalid token');
    }
};

export { authenticate, AuthRequest };