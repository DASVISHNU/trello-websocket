import Router from "express";

import {
    getOrganizationMembers,
    addMember
} from "../controllers/membership.controllers";

import authMiddleware from "../middlwares/auth.middleware";
import adminMiddleware from "../middlwares/admin.middleware";


const router = Router();


// Get organization members
router.get(
    "/:organizationId/members",
    authMiddleware,
    getOrganizationMembers
);


// Add member
router.post(
    "/:organizationId/members",
    authMiddleware,
    adminMiddleware,
    addMember
);


export default router;