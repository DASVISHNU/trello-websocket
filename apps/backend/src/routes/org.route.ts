import { Router } from "express";
import {
    createOrganization,
    getMyOrganizations
} from "../controllers/organization.controllers";

import { authMiddleware } from "../middlwares/auth.middleware.ts";

const router = Router();

router.get(
    "/",
    authMiddleware,
    getMyOrganizations
);

router.post(
    "/",
    authMiddleware,
    createOrganization
);

export default router;