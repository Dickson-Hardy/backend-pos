import { ProductCategory, UnitOfMeasure } from "../../../schemas/product.schema";
import { CreatePackVariantDto } from "./pack-variant.dto";
export declare class CreateProductDto {
    name: string;
    sku: string;
    barcode?: string;
    description: string;
    category: ProductCategory;
    manufacturer: string;
    genericName: string;
    strength: string;
    unitOfMeasure: UnitOfMeasure;
    costPrice: number;
    sellingPrice: number;
    stockQuantity: number;
    reorderLevel: number;
    maxStockLevel: number;
    image?: string;
    requiresPrescription: boolean;
    activeIngredients?: string[];
    dosageInstructions?: string;
    storageInstructions?: string;
    outletId: string;
    allowUnitSale?: boolean;
    packVariants?: CreatePackVariantDto[];
}
