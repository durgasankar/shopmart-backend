import { Request, Response } from "express";
import { BaseController } from "./base-controller";
import { ProductService } from "../services/Product";
import { logger } from "../configs/winston-logger";
import { getAddProductFormattedBody } from "../utils/request-formatter";

export class ProductControlller extends BaseController {
    private productService: ProductService;

    constructor() {
        super();
        this.productService = new ProductService();
    }

    public addProductController = async (req: Request, res: Response) => {
        try {
            const newProduct = getAddProductFormattedBody(req.body);
            // add image path
            if (req.file) {
                newProduct.image = req.file.buffer;
            }
            const productId: string = await this.productService.addNewProduct(newProduct);
            return this.created(res, "Registration successful.", { productId });
        } catch (error: any) {
            const message: string = `Product registration Error: ${error.message}`
            logger.error(message);
            return this.badRequest(res, message);
        }
    }

    public getAllProductsController = async (req: Request, res: Response) => {
        try {
            const products = await this.productService.getAllProducts();
            return this.ok(res, "Available products.", products);
        } catch (error: any) {
            const message: string = `Fetch products error: ${error.message}`
            logger.error(message);
            return this.badRequest(res, message);
        }
    }
}