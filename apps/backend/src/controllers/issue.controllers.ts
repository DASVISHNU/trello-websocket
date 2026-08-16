import { prisma } from "db/client";
import type { Request, Response } from "express";

export const createIssue = async (
    req: Request,
    res: Response
) => {
    try {
        const { sectionId } = req.params;
        const { title, description } = req.body;

        if (typeof sectionId !== "string") {
            return res.status(400).json({
                message: "Invalid section ID"
            });
        }

        if (!title) {
            return res.status(400).json({
                message: "Issue title is required"
            });
        }

        const issue = await prisma.issue.create({
            data: {
                title,
                description,
                sectionId
            }
        });

        return res.status(201).json({
            message: "Issue created successfully",
            issue
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};


export const getIssues = async (
    req: Request,
    res: Response
) => {
    try {
        const { sectionId } = req.params;

        if (typeof sectionId !== "string") {
            return res.status(400).json({
                message: "Invalid section ID"
            });
        }

        const issues = await prisma.issue.findMany({
            where: {
                sectionId
            }
        });

        return res.status(200).json({
            issues
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const updateIssue = async (
    req: Request,
    res: Response
) => {
    try {
        const { issueId } = req.params;
        const { title, description } = req.body;

        if (typeof issueId !== "string") {
            return res.status(400).json({
                message: "Invalid issue ID"
            });
        }

        const issue = await prisma.issue.update({
            where: {
                id: issueId
            },
            data: {
                title,
                description
            }
        });

        return res.status(200).json({
            message: "Issue updated successfully",
            issue
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const deleteIssue = async (
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

        await prisma.issue.delete({
            where: {
                id: issueId
            }
        });

        return res.status(200).json({
            message: "Issue deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

