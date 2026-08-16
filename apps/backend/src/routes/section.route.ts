import Router from "express";
import { getSections,createSection } from "../controllers/section.controllers";
import authMiddleware from "../middlwares/auth.middleware";

const router=Router();
router.post("/:organizationId/boards/:boardId/sections",authMiddleware,createSection);
router.get("/:organizationId/boards/:boardId/sections",authMiddleware,getSections);


export default router;

