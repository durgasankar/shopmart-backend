import { Router } from "express";
import { ProductControlller } from "../controllers/Product";
import { validateAddProductRequest } from "../middlewares/validate";
import { upload } from "../middlewares/upload";

const router = Router();
const { addProductController } = new ProductControlller;

router.post(
    '/add',
    upload.single('image'),
    validateAddProductRequest,
    addProductController
);

export default router;
