import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "db/client";


// =====================================================
// GET ORGANIZATION MEMBERS
// =====================================================

export const getOrganizationMembers = async (
    req: Request<{ organizationId: string }>,
    res: Response
) => {

    try {

        const { organizationId } = req.params;


        const members =
            await prisma.membership.findMany({

                where: {
                    organizationId: organizationId
                },

                include: {

                    user: {

                        select: {

                            id: true,

                            username: true

                        }

                    }

                }

            });


        return res.status(200).json({

            success: true,

            members

        });

    }

    catch (error) {

        console.error(
            "Get members error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to get organization members"

        });

    }

};


// =====================================================
// ADD MEMBER
// =====================================================

export const addMember = async (
    req: Request<{ organizationId: string }>,
    res: Response
) => {

    try {

        const { organizationId } =
            req.params;


        const {
            username,
            password
        } = req.body;


        // =================================================
        // VALIDATION
        // =================================================

        if (
            !username ||
            !password
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Username and password are required"

            });

        }


        // =================================================
        // FIND USER
        // =================================================

        const user =
            await prisma.user.findUnique({

                where: {

                    username: username

                }

            });


        if (!user) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found"

            });

        }


        // =================================================
        // VERIFY PASSWORD
        // =================================================

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid username or password"

            });

        }


        // =================================================
        // CHECK EXISTING MEMBERSHIP
        // =================================================

        const existingMembership =
            await prisma.membership.findUnique({

                where: {

                    userId_organizationId: {

                        userId: user.id,

                        organizationId:
                            organizationId

                    }

                }

            });


        if (existingMembership) {

            return res.status(409).json({

                success: false,

                message:
                    "User is already a member of this organization"

            });

        }


        // =================================================
        // CREATE MEMBERSHIP
        // =================================================

        const membership =
            await prisma.membership.create({

                data: {

                    userId:
                        user.id,

                    organizationId:
                        organizationId,

                    role:
                        "MEMBER"

                },

                include: {

                    user: {

                        select: {

                            id: true,

                            username: true

                        }

                    }

                }

            });


        // =================================================
        // SUCCESS
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Member added successfully",

            membership

        });

    }

    catch (error) {

        console.error(
            "Add member error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to add member"

        });

    }

};