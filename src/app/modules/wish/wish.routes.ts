import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { Roles } from "../../../generated/prisma/enums";
import { wishController } from "./wish.controller";

const router = Router();

router.post("/", checkAuth(Roles.CUSTOMER), wishController.addToWish);
router.get("/my-wish", checkAuth(Roles.CUSTOMER), wishController.myWish);
router.delete("item/:id", checkAuth(Roles.CUSTOMER), wishController.deleteWish);
router.delete("/clear", checkAuth(Roles.CUSTOMER), wishController.clearWish);

export const wishRoutes = router;
