import type { Request, Response, NextFunction } from "express";
import { prisma } from "db/client";

const adminMiddleware = async (
    req: Request<{ organizationId: string }>,
    res: Response,
    next: NextFunction
) => {

    try {

        const { organizationId } = req.params;

        const userId = req.userId;


        if (!userId) {

            return res.status(401).json({
                message: "User not authenticated"
            });

        }


        // Find user's membership in this organization
        const membership =
            await prisma.membership.findUnique({

                where: {
                    userId_organizationId: {
                        userId,
                        organizationId
                    }
                }

            });


        // User is not part of organization
        if (!membership) {

            return res.status(403).json({
                message:
                    "You are not a member of this organization"
            });

        }


        // User is not admin
        if (membership.role !== "ADMIN") {

            return res.status(403).json({
                message:
                    "Only organization admins can perform this action"
            });

        }


        // User is admin
        next();

    }

    catch (error) {

        console.error(
            "Admin middleware error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to verify organization permissions"
        });

    }

};

export default adminMiddleware;