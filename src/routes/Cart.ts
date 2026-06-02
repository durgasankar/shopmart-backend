import { Router } from "express";
import { CartController } from "../controllers/Cart";
import { authenticate } from "../middlewares/auth-validator";

const router = Router();
const controller = new CartController();

// jwt auth bearer token handler
router.use(authenticate);

router.get("/all", controller.getCartController);
router.post("/add", controller.addToCartController);
router.post("/update", controller.updateQtyController);
router.post("/remove", controller.removeItemController);

export default router;