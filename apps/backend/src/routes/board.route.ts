import {Router} from "express";
import { getBoards,createBoard } from "../controllers/board.controllers";
import authMiddleware from "../middlwares/auth.middleware";
const router=Router();

router.get("/:organizationId/boards",authMiddleware,getBoards)
router.post("/:organizationId/boards",authMiddleware,createBoard)

export default router;