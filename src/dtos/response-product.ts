import { ProductAttributes } from "../models/Product";

export interface Productresponse extends Omit<ProductAttributes, 'image' | 'createdAt' | 'updatedAt'> {
    addedOn?: string;
}