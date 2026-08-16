import { prisma } from "db/client";
import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
export const signup = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // 1. Validate input
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        // 2. Check whether user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Username already exists"
            });
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create user
        const user = await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword
            }
        });

        // 5. Don't send password back
        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.id,
                username: user.username
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const signin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        // 1. Check input
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }

        // 2. Find user
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        // 3. User doesn't exist
        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // 4. Compare entered password with hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        // 5. Wrong password
        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // 6. Generate JWT
        const token = jwt.sign(
            {
                userId: user.id
            },
            process.env.JWT_SECRET!,
            {
                expiresIn: "7d"
            }
        );

        // 7. Send token
        return res.status(200).json({
            message: "Signin successful",
            token
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export default {signin,signup} ;