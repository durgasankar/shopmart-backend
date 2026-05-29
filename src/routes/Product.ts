import { Router } from "express";
import { ProductControlller } from "../controllers/Product";
import { validateAddProductRequest } from "../middlewares/validate";

const router = Router();
const { addProductController } = new ProductControlller;

router.post('/add', validateAddProductRequest, addProductController)

export default router;
