import { Router } from "express";
import { reviewController } from "./review.controller";
import { Roles } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.post("/", checkAuth(Roles.CUSTOMER), reviewController.giveReview);
router.get("/", reviewController.getAllReview);

export const reviewRoutes = router;
