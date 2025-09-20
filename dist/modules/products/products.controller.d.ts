import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<import("../../schemas/product.schema").Product>;
    findAll(outletId?: string): Promise<import("../../schemas/product.schema").Product[]>;
    findLowStock(outletId?: string): Promise<import("../../schemas/product.schema").Product[]>;
    search(query: string): Promise<import("../../schemas/product.schema").Product[]>;
    findByBarcode(barcode: string): Promise<import("../../schemas/product.schema").Product>;
    findOne(id: string): Promise<import("../../schemas/product.schema").Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("../../schemas/product.schema").Product>;
    updatePut(id: string, updateProductDto: UpdateProductDto): Promise<import("../../schemas/product.schema").Product>;
    remove(id: string): Promise<void>;
    updateStock(id: string, body: {
        quantity: number;
    }): Promise<import("../../schemas/product.schema").Product>;
}
