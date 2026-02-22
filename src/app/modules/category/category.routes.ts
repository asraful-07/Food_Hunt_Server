import { Router } from "express";
import {
  CreateCategoryController,
  GetsCategoryController,
} from "./category.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Roles } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", checkAuth(Roles.ADMIN), CreateCategoryController);
router.get("/", GetsCategoryController);

export const categoryRoutes = router;
