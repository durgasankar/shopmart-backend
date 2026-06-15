import { ProductAttributes } from "../../models/Product";

export interface IProductService {
    addNewProduct(product: ProductAttributes): Promise<string>;

    getAllProducts(): Promise<any[]>;
}