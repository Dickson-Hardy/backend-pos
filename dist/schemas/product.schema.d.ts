import { type Document, Types } from "mongoose";
export type ProductDocument = Product & Document;
export declare enum ProductCategory {
    PRESCRIPTION = "prescription",
    OTC = "otc",
    PAIN_RELIEF = "pain_relief",
    ANTIBIOTICS = "antibiotics",
    CARDIOVASCULAR = "cardiovascular",
    DIABETES = "diabetes",
    GASTROINTESTINAL = "gastrointestinal",
    RESPIRATORY = "respiratory",
    MENTAL_HEALTH = "mental_health",
    VITAMINS = "vitamins",
    DERMATOLOGY = "dermatology",
    MEDICAL_EQUIPMENT = "medical_equipment",
    SUPPLEMENTS = "supplements",
    PERSONAL_CARE = "personal_care",
    FIRST_AID = "first_aid"
}
export declare enum ProductStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    DISCONTINUED = "discontinued"
}
export declare enum UnitOfMeasure {
    TABLETS = "tablets",
    CAPSULES = "capsules",
    SOFTGELS = "softgels",
    INHALERS = "inhalers",
    TUBES = "tubes",
    ML = "ml",
    MG = "mg",
    GRAMS = "grams",
    PIECES = "pieces",
    BOTTLES = "bottles",
    BOXES = "boxes",
    STRIPS = "strips",
    VIALS = "vials"
}
export declare class Product {
    name: string;
    sku: string;
    barcode: string;
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
    status: ProductStatus;
    image: string;
    requiresPrescription: boolean;
    activeIngredients: string[];
    sideEffects: string[];
    dosageInstructions: string;
    storageInstructions: string;
    outletId: Types.ObjectId;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product> & Product & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>> & import("mongoose").FlatRecord<Product> & {
    _id: Types.ObjectId;
}>;
