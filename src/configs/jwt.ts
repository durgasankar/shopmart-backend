import dotenv from 'dotenv';
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { logger } from './winston-logger';

dotenv.config();

const SECRET: Secret = process.env.JWT_SECRET as string;
const EXPIRES_IN: any = process.env.JWT_EXPIRY || '1d';

export interface CustomJwtPayload extends JwtPayload {
    userId: number,
    email: string
}

export const generateToken = (payload: CustomJwtPayload, options?: SignOptions): string => {
    return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN, ...options });
}

export const verifyToken = (token: string): CustomJwtPayload | null => {
    try {
        const decoded = jwt.verify(token, SECRET);
        return decoded as CustomJwtPayload;
    } catch (error: any) {
        logger.error('JWT verification error', { message: error.message, stack: error.stack });
    }
    return null;
}
