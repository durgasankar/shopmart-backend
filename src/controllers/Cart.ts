import { Request, Response } from "express";
import { CartService } from "../services/Cart";
import { getIo } from "../configs/socket";
import { BaseController } from "./base-controller";
import { logger } from "../configs/winston-logger";
import { ICartService } from "../services/interfaces/ICartService";

export class CartController extends BaseController {
    private cartService: ICartService;

    constructor() {
        super();
        this.cartService = new CartService();
    }

    public getCartController = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const cart = await this.cartService.getUserCart(userId);
            return res.json({ success: true, data: cart });
        } catch (error: any) {
            const message = `Get cart error: ${error.message}`;
            logger.error(message);
            return res.status(500).json({ success: false, message });
        }
    };

    public addToCartController = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const { productId } = req.body;
            const cart = await this.cartService.addToCart(
                userId,
                Number(productId)
            );
            // updation via socket
            const io = getIo();
            io.to(userId).emit("cartUpdated", cart);
            return res.json({ success: true, data: cart });
        } catch (error: any) {
            const message = `Add to cart error: ${error.message}`;
            logger.error(message);
            return res.status(500).json({ success: false, message });
        }
    };

    public updateQtyController = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const { productId, action } = req.body;
            const cart = await this.cartService.updateQuantity(
                userId,
                Number(productId),
                action
            );
            // socket emmision
            const io = getIo();
            io.to(userId).emit("cartUpdated", cart);
            return res.json({ success: true, data: cart });
        } catch (error: any) {
            const message = `Update cart quantity error: ${error.message}`;
            logger.error(message);
            return res.status(500).json({ success: false, message });
        }
    };

    public removeItemController = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const { productId } = req.body;
            const cart = await this.cartService.removeItem(userId, Number(productId));
            const io = getIo();
            // socket emmision
            io.to(userId).emit("cartUpdated", cart);
            return res.json({ success: true, data: cart });
        } catch (error: any) {
            const message = `Remove item error: ${error.message}`;
            logger.error(message);
            return res.status(500).json({ success: false, message });
        }
    };
}