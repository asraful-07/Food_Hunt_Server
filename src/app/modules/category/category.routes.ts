import { Router } from "express";
import {
  CreateCategoryController,
  GetCategoryController,
  GetsCategoryController,
  SoftDeleteCategoryController,
  UpdateCategoryController,
} from "./category.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Roles } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", checkAuth(Roles.ADMIN), CreateCategoryController);
router.get("/", GetsCategoryController);
router.get("/:id", GetCategoryController);
router.put("/:id", checkAuth(Roles.ADMIN), UpdateCategoryController);
router.delete("/:id", checkAuth(Roles.ADMIN), SoftDeleteCategoryController);

export const categoryRoutes = router;
