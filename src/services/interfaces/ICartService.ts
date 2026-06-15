export interface ICartService {
    getUserCart(userId: string): Promise<any>;

    addToCart(userId: string, productId: number): Promise<any>;

    updateQuantity(
        userId: string,
        productId: number,
        action: "inc" | "dec"
    ): Promise<any>;

    removeItem(userId: string, productId: number): Promise<any>;
}