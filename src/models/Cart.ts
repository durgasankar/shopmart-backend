import mongoose, { Document, Schema } from "mongoose";

export interface CartItem {
    productId: number;
    name: string;
    price: number;
    // imageUrl?: string;
    quantity: number;
}

export interface CartDocument extends Document {
    userId: string;
    items: CartItem[];
    totalAmount: number;
}

const CartItemSchema = new Schema<CartItem>({
    productId: { type: Number, required: true },
    name: String,
    price: Number,
    // imageUrl: String,
    quantity: { type: Number, default: 1 }
});

const CartSchema = new Schema<CartDocument>({
    userId: { type: String, required: true },
    items: [CartItemSchema],
    totalAmount: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.model<CartDocument>("Cart", CartSchema);