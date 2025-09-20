import type { Model } from "mongoose";
import { Product, type ProductDocument } from "../../schemas/product.schema";
import { type BatchDocument } from "../../schemas/batch.schema";
import type { CreateProductDto } from "./dto/create-product.dto";
import type { UpdateProductDto } from "./dto/update-product.dto";
export declare class ProductsService {
    private productModel;
    private batchModel;
    constructor(productModel: Model<ProductDocument>, batchModel: Model<BatchDocument>);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(outletId?: string): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
    findByBarcode(barcode: string): Promise<Product>;
    findLowStock(outletId?: string): Promise<Product[]>;
    search(query: string): Promise<Product[]>;
    updateStock(productId: string, quantity: number): Promise<Product>;
}
