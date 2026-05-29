import { logger } from "../configs/winston-logger";
import { Productresponse } from "../dtos/response-product";
import Product, { ProductAttributes } from "../models/Product";
import { formatDateTime } from "../utils/date-time-formatter";

export class ProductService {

    private getProductUniqueIdentifier(product: Product): string {
        const { id, category } = product.toJSON();
        const productIdentifier: string = `${category.slice(0, 4).toUpperCase()}-${id}`;
        return productIdentifier;
    }

    private async getProductByName(productName: string): Promise<Product | null> {
        const fetchedProduct = await Product.findOne({ where: { name: productName } });
        if (fetchedProduct) {
            return fetchedProduct;
        }
        return null;
    }

    public async addNewProduct(newProduct: ProductAttributes): Promise<string> {
        // existing product
        const fetchedProduct = await this.getProductByName(newProduct.name);
        if (fetchedProduct) {
            const productId: string = this.getProductUniqueIdentifier(fetchedProduct);
            throw new Error(`already registered id: ${productId}`);
        }
        // new product registration
        const createdProduct = await Product.create({ ...newProduct });
        const generatedProductId: string = this.getProductUniqueIdentifier(createdProduct);
        return generatedProductId;
    }

    public async getAllProducts(): Promise<Productresponse[]> {
        const products = await Product.findAll();
        const filteredProducts: Productresponse[] = products.map(product => {
            // removing image as its making response heavy
            const { image, updatedAt, createdAt, ...rest } = product.toJSON();
            const addedOn: string = formatDateTime(createdAt);
            return {...rest, addedOn};
        })
        return filteredProducts;
    }
}