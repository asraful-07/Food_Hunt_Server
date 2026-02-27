import { Router } from "express";
import { OrderController } from "./order.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Roles } from "../../../generated/prisma/enums";

const router = Router();

router.post("/", checkAuth(Roles.CUSTOMER), OrderController.createOrder);
router.get("/my-order", checkAuth(Roles.CUSTOMER), OrderController.getMyOrders);
router.get(
  "/provider-order",
  checkAuth(Roles.PROVIDER),
  OrderController.getProviderOrders,
);
router.get(
  "/all-orders",
  checkAuth(Roles.ADMIN),
  OrderController.getsAllOrders,
);
router.get(
  "/single/:id",
  checkAuth(Roles.ADMIN, Roles.CUSTOMER, Roles.PROVIDER),
  OrderController.getSingleOrder,
);
router.patch(
  "/:id",
  checkAuth(Roles.PROVIDER),
  OrderController.updateOrderStatus,
);
router.patch(
  "/:id/cancel",
  checkAuth(Roles.CUSTOMER),
  OrderController.updateCustomerOrderStatus,
);

export const orderRoutes = router;
