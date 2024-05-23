import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
export interface AuthenticatedRequest extends Request {
    userId: string;
}


export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const JWT_SECRET = 'your_jwt_secret';
    if (!token) {
        return res.status(401).json({ message: 'Access denied, no token provided' });
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id; // Set the userId property
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};
