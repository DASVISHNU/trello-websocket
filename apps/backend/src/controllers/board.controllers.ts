import { prisma } from "db/client";
import type { Request, Response } from "express";

export const createBoard = async (
    req: Request,
    res: Response
) => {
    try {

        const { organizationId } = req.params;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Board title is required"
            });
        }
         if (typeof organizationId !== "string") {
            return res.status(400).json({
                message: "Invalid organization ID"
            });
        }

        const board = await prisma.board.create({
            data: {
                title,
                organizationId
            }
        });

        return res.status(201).json({
            message: "Board created successfully",
            board
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getBoards = async (
    req: Request,
    res: Response
) => {
    try {

        const { organizationId } = req.params;
         if (typeof organizationId !== "string") {
            return res.status(400).json({
                message: "Invalid organization ID"
            });
        }
        const boards = await prisma.board.findMany({
            where: {
                organizationId
            }
        });

        return res.status(200).json({
            boards
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};