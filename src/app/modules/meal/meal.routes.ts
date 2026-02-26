import { Router } from "express";
import { mealController } from "./meal.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Roles } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", checkAuth(Roles.PROVIDER), mealController.createMeal);
router.get("/", mealController.getAllMeal);
router.get("/:id", mealController.getMeal);
router.get(
  "/provider-meal",
  checkAuth(Roles.PROVIDER),
  mealController.getMyMeal,
);
router.put("/:id", checkAuth(Roles.PROVIDER), mealController.updateMeal);
router.delete("/:id", checkAuth(Roles.PROVIDER), mealController.softDeleteMeal);

export const mealRoutes = router;
