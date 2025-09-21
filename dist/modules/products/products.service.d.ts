import type { Model } from "mongoose";
import { Product, type ProductDocument } from "../../schemas/product.schema";
import { type BatchDocument } from "../../schemas/batch.schema";
import { PackVariant, type PackVariantDocument } from "../../schemas/pack-variant.schema";
import type { CreateProductDto } from "./dto/create-product.dto";
import type { UpdateProductDto } from "./dto/update-product.dto";
export declare class ProductsService {
    private productModel;
    private batchModel;
    private packVariantModel;
    constructor(productModel: Model<ProductDocument>, batchModel: Model<BatchDocument>, packVariantModel: Model<PackVariantDocument>);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(outletId?: string): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    remove(id: string): Promise<void>;
    findByBarcode(barcode: string): Promise<Product>;
    findLowStock(outletId?: string): Promise<Product[]>;
    search(query: string): Promise<Product[]>;
    updateStock(productId: string, quantity: number): Promise<Product>;
    getPackVariants(productId: string): Promise<PackVariant[]>;
    calculatePackInventory(totalUnits: number, packVariants: PackVariant[]): Promise<{
        packBreakdown: Array<{
            variant: PackVariant;
            availablePacks: number;
        }>;
        looseUnits: number;
        totalValue: number;
    }>;
}
