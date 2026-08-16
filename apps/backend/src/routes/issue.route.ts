import Router from "express";
import { createIssue,getIssues,deleteIssue,updateIssue } from "../controllers/issue.controllers";
import authMiddleware from "../middlwares/auth.middleware";

const router=Router();
router.post("/:organizationId/boards/:boardId/sections/:sectionId/issues",authMiddleware,createIssue)
router.get("/:organizationId/boards/:boardId/sections/:sectionId/issues",authMiddleware,getIssues)
router.delete("/:organizationId/boards/:boardId/sections/:sectionId/issues/:issueId",authMiddleware,deleteIssue)
router.put("/:organizationId/boards/:boardId/sections/:sectionId/issues/:issueId",authMiddleware,updateIssue)
export default router;
