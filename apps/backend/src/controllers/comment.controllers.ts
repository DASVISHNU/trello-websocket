import { prisma } from "db/client";
import type { Request, Response } from "express";

export const createComment = async (
    req: Request,
    res: Response
) => {
    try {
        const { issueId } = req.params;
        const { content } = req.body;

        if (typeof issueId !== "string") {
            return res.status(400).json({
                message: "Invalid issue ID"
            });
        }

        if (!content) {
            return res.status(400).json({
                message: "Comment content is required"
            });
        }

        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                issueId,
                userId
            }
        });

        return res.status(201).json({
            message: "Comment created successfully",
            comment
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getComments = async (
    req: Request,
    res: Response
) => {
    try {
        const { issueId } = req.params;

        if (typeof issueId !== "string") {
            return res.status(400).json({
                message: "Invalid issue ID"
            });
        }

        const comments = await prisma.comment.findMany({
            where: {
                issueId
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        return res.status(200).json({
            comments
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const updateComment = async (
    req: Request,
    res: Response
) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        if (typeof commentId !== "string") {
            return res.status(400).json({
                message: "Invalid comment ID"
            });
        }

        if (!content) {
            return res.status(400).json({
                message: "Comment content is required"
            });
        }

        const comment = await prisma.comment.update({
            where: {
                id: commentId
            },
            data: {
                content
            }
        });

        return res.status(200).json({
            message: "Comment updated successfully",
            comment
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const deleteComment = async (
    req: Request,
    res: Response
) => {
    try {
        const { commentId } = req.params;

        if (typeof commentId !== "string") {
            return res.status(400).json({
                message: "Invalid comment ID"
            });
        }

        await prisma.comment.delete({
            where: {
                id: commentId
            }
        });

        return res.status(200).json({
            message: "Comment deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};