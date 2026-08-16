import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        // Authorization header missing
        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization header missing"
            });
        }

        // Expected format:
        // Authorization: Bearer <token>

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Token missing"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET!
        )as {userId:string};

        console.log(decoded);
        req.userId=decoded.userId;

        // Token is valid
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

export default authMiddleware;