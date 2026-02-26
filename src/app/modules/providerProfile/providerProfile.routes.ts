import { Router } from "express";
import { providerProfileController } from "./providerProfile.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Roles } from "../../../generated/prisma/enums";

const router = Router();

router.get("/all-provider", providerProfileController.getAllProviderProfile);
router.get("/:id", providerProfileController.getSingleProviderProfile);
router.put(
  "/:id",
  checkAuth(Roles.PROVIDER),
  providerProfileController.updateProviderProfile,
);
router.delete(
  "/:id",
  checkAuth(Roles.ADMIN),
  providerProfileController.deleteProviderProfile,
);

export const providerProfileRoutes = router;
