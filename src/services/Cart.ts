import Cart from "../models/Cart";
import Product from "../models/Product";

export class CartService {

    private calculateTotal(items: any[]): number {
        return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }

    public async getUserCart(userId: string) {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = await Cart.create({ userId, items: [], totalAmount: 0 });
        }
        return cart;
    }

    public async addToCart(userId: string, productId: number) {
        const product = await Product.findByPk(productId);
        if (!product) throw new Error("Product not found");
        let cart = await this.getUserCart(userId);
        const existingItem = cart.items.find(i => i.productId === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                productId,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        cart.totalAmount = this.calculateTotal(cart.items);
        await cart.save();
        return cart;
    }

    public async updateQuantity(userId: string, productId: number, action: "inc" | "dec") {
        const cart = await this.getUserCart(userId);
        const item = cart.items.find(i => i.productId === productId);
        if (!item) throw new Error("Item not found");
        if (action === "inc") item.quantity += 1;
        else item.quantity -= 1;
        if (item.quantity <= 0) {
            cart.items = cart.items.filter(i => i.productId !== productId);
        }
        cart.totalAmount = this.calculateTotal(cart.items);
        await cart.save();
        return cart;
    }

    public async removeItem(userId: string, productId: number) {
        const cart = await this.getUserCart(userId);
        cart.items = cart.items.filter(i => i.productId !== productId);
        cart.totalAmount = this.calculateTotal(cart.items);
        await cart.save();
        return cart;
    }
}