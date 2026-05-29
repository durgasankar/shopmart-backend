import { Router } from "express";
import { ProductControlller } from "../controllers/Product";
import { upload } from "../middlewares/upload";
import { validateAddProductRequest } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth-validator";

const router = Router();
const { addProductController, getAllProductsController } = new ProductControlller;

// jwt auth bearer token handler
router.use(authenticate);

router.post(
    '/add',
    upload.single('image'),
    validateAddProductRequest,
    addProductController
);

router.get('/all', getAllProductsController)


export default router;
