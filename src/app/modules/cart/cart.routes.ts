import { Router } from "express";
import { cartController } from "./cart.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Roles } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", checkAuth(Roles.CUSTOMER), cartController.addToCart);
router.get("/my-cart", checkAuth(Roles.CUSTOMER), cartController.myCart);
router.delete("item/:id", checkAuth(Roles.CUSTOMER), cartController.deleteCart);
router.delete("/clear", checkAuth(Roles.CUSTOMER), cartController.clearCart);

export const cartRoutes = router;
