import Router from "express";

import {
    createComment,
    getComments,
    updateComment,
    deleteComment
} from "../controllers/comment.controllers";

import authMiddleware from "../middlwares/auth.middleware";

const router = Router();

router.post(
    "/:organizationId/boards/:boardId/sections/:sectionId/issues/:issueId/comments",
    authMiddleware,
    createComment
);

router.get(
    "/:organizationId/boards/:boardId/sections/:sectionId/issues/:issueId/comments",
    authMiddleware,
    getComments
);

router.put(
    "/:organizationId/boards/:boardId/sections/:sectionId/issues/:issueId/comments/:commentId",
    authMiddleware,
    updateComment
);

router.delete(
    "/:organizationId/boards/:boardId/sections/:sectionId/issues/:issueId/comments/:commentId",
    authMiddleware,
    deleteComment
);

export default router;