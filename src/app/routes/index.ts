import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { userRoutes } from "../modules/user/user.routes";
import { categoryRoutes } from "../modules/category/category.routes";
import { mealRoutes } from "../modules/meal/meal.routes";
import { cartRoutes } from "../modules/cart/cart.routes";
import { orderRoutes } from "../modules/order/order.routes";
import { wishRoutes } from "../modules/wish/wish.routes";
import { providerProfileRoutes } from "../modules/providerProfile/providerProfile.routes";
import { reviewRoutes } from "../modules/review/review.routes";
import { statsRoutes } from "../modules/stats/stats.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/provider", userRoutes);
router.use("/provider-profile", providerProfileRoutes);
router.use("/category", categoryRoutes);
router.use("/meal", mealRoutes);
router.use("/cart", cartRoutes);
router.use("/wish", wishRoutes);
router.use("/order", orderRoutes);
router.use("/review", reviewRoutes);
router.use("/stats", statsRoutes);

export const IndexRoutes = router;
