import { Router } from "express";
import {
  CreateCustomerController,
  LoginCustomerController,
} from "./auth.controller";

const router = Router();

router.post("/register", CreateCustomerController);
router.post("/login", LoginCustomerController);

export const authRoutes = router;
