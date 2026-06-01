import { Router } from "express";
import { CartController } from "../controllers/Cart";
import { authenticate } from "../middlewares/auth-validator";

const router = Router();
const controller = new CartController();

router.use(authenticate);

router.get("/all", controller.getCart);
router.post("/add", controller.addToCart);
router.post("/update", controller.updateQty);
router.post("/remove", controller.removeItem);

export default router;