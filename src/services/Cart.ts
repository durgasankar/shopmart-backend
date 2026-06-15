import { logger } from "../configs/winston-logger";
import Cart from "../models/Cart";
import Product from "../models/Product";
import { ICartService } from "./interfaces/ICartService";

export class CartService implements ICartService {

    private calculateTotal(items: any[]): number {
        return items.reduce((total, item) => {
            const cleanPrice = parseFloat(item.price) || 0;
            const cleanQuantity = parseInt(item.quantity, 10) || 0;
            return total + (cleanPrice * cleanQuantity);
        }, 0);
    }

    private isValidQuantity(newQuantity: number, availableQuantity: number): boolean {
        if (newQuantity < 0) return false;
        if (newQuantity > availableQuantity) return false;
        return true;
    }

    public async getUserCart(userId: string) {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = await Cart.create({ userId, items: [], totalAmount: 0 });
        }
        return cart;
    }

    public async addToCart(userId: string, productId: number) {
        const product = await Product.findByPk(productId, {
            attributes: ['price', 'name', 'quantity'],
            raw: true
        });
        if (!product) throw new Error("Product not found");
        let cart = await this.getUserCart(userId);
        const existingItem = cart.items.find(item => item.productId === productId);
        const { price, name, quantity } = product;
        if (existingItem) {
            if (!this.isValidQuantity(existingItem.quantity + 1, quantity)) {
                throw new Error("Cannot add more than available stock");
            }
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                productId,
                name,
                price,
                quantity: 1
            });
        }
        cart.totalAmount = this.calculateTotal(cart.items);
        await cart.save();
        return cart;
    }

    public async updateQuantity(userId: string, productId: number, action: "inc" | "dec") {
        logger.info(`${userId}-${productId}-${action}`)
        // get user cart
        const cart = await this.getUserCart(userId);
        const item = cart.items.find(item => item.productId === productId);
        if (!item) throw new Error("Item not found");
        // fetch only available stock
        const availableQuantity = (await Product.findByPk(productId, {
            attributes: ['quantity'],
            raw: true
        }))?.quantity as number;
        const newQuantity =
            action === "inc"
                ? item.quantity + 1
                : item.quantity - 1;
        if (!this.isValidQuantity(newQuantity, availableQuantity)) {
            throw new Error("Cannot add more than available stock");
        }
        item.quantity = newQuantity;
        if (item.quantity <= 0) {
            cart.items = cart.items.filter(i => i.productId !== productId);
        }
        cart.totalAmount = this.calculateTotal(cart.items);
        await cart.save();
        return cart;
    }

    public async removeItem(userId: string, productId: number) {
        const cart = await this.getUserCart(userId);
        cart.items = cart.items.filter(item => item.productId !== productId);
        cart.totalAmount = this.calculateTotal(cart.items);
        await cart.save();
        return cart;
    }
}