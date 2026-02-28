import express from "express";
import { Roles } from "../../../generated/prisma/browser";
import { checkAuth } from "../../middleware/checkAuth";
import { StatsController } from "./stats.controller";

const router = express.Router();

router.get(
  "/",
  checkAuth(Roles.ADMIN, Roles.PROVIDER, Roles.CUSTOMER),
  StatsController.getDashboardStatsData,
);

export const statsRoutes = router;
