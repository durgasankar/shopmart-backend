import { Request, Response } from "express";
import { CartService } from "../services/Cart";
import { getIo } from "../configs/socket";

export class CartController {
    private cartService = new CartService();

    public getCart = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const cart = await this.cartService.getUserCart(userId);
            res.json({ success: true, data: cart });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    };

    public addToCart = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const { productId } = req.body;
            const cart = await this.cartService.addToCart(userId, Number(productId));
            
            const io = getIo();
            io.to(userId).emit("cartUpdated", cart);
            
            res.json({ success: true, data: cart });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    };

    public updateQty = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const { productId, action } = req.body;
            const cart = await this.cartService.updateQuantity(userId, Number(productId), action);
            
            const io = getIo();
            io.to(userId).emit("cartUpdated", cart);
            
            res.json({ success: true, data: cart });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    };

    public removeItem = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.userId;
            const { productId } = req.body;
            const cart = await this.cartService.removeItem(userId, Number(productId));
            
            const io = getIo();
            io.to(userId).emit("cartUpdated", cart);
            
            res.json({ success: true, data: cart });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    };
}