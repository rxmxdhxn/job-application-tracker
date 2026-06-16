import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export interface AuthRequest extends Request {
    user?: { id: number; email: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}
