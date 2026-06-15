import { logger } from "../configs/winston-logger";
import Product, { ProductAttributes } from "../models/Product";
import { formatDateTime } from "../utils/date-time-formatter";
import { IProductService } from "./interfaces/IProductService";

export class ProductService implements IProductService {

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

    public async getAllProducts(): Promise<any[]> {
        const products = await Product.findAll();
        const filteredProducts = products.map(product => {
            const productJson = product.toJSON();
            const { image, createdAt, updatedAt, ...rest } = productJson;
            // Converting to base64 img
            let base64Image = null;
            if (image && Buffer.isBuffer(image)) {
                base64Image = `data:image/jpeg;base64,${image.toString('base64')}`;
            } else if (image && (image as any).type === 'Buffer') {
                const buf = Buffer.from((image as any).data);
                base64Image = `data:image/jpeg;base64,${buf.toString('base64')}`;
            }
            const addedOn: string = formatDateTime(createdAt);
            return {
                ...rest,
                addedOn,
                imageUrl: base64Image
            };
        });
        return filteredProducts;
    }
}