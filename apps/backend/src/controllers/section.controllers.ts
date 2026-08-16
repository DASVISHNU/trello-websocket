import { prisma } from "db/client";
import type { Request, Response } from "express";

export const createSection = async (
    req: Request,
    res: Response
) => {
    try {

        const { boardId } = req.params;
        const { title } = req.body;

        if (typeof boardId !== "string") {
            return res.status(400).json({
                message: "Invalid board ID"
            });
        }

        if (!title) {
            return res.status(400).json({
                message: "Section title is required"
            });
        }

        const section = await prisma.section.create({
            data: {
                title,
                boardId
            }
        });

        return res.status(201).json({
            message: "Section created successfully",
            section
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getSections = async (
    req: Request,
    res: Response
) => {
    try {

        const { boardId } = req.params;

        if (typeof boardId !== "string") {
            return res.status(400).json({
                message: "Invalid board ID"
            });
        }

        const sections = await prisma.section.findMany({
            where: {
                boardId
            }
        });

        return res.status(200).json({
            sections
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};