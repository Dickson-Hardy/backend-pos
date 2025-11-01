import { SuppliersService } from "./suppliers.service";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    create(createSupplierDto: CreateSupplierDto): Promise<import("../../schemas/supplier.schema").Supplier>;
    findAll(outletId?: string, status?: string): Promise<import("../../schemas/supplier.schema").Supplier[]>;
    getStats(outletId?: string): Promise<any>;
    findOne(id: string): Promise<import("../../schemas/supplier.schema").Supplier>;
    update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<import("../../schemas/supplier.schema").Supplier>;
    updateFull(id: string, updateSupplierDto: UpdateSupplierDto): Promise<import("../../schemas/supplier.schema").Supplier>;
    remove(id: string): Promise<void>;
    updateRating(id: string, body: {
        rating: number;
    }): Promise<import("../../schemas/supplier.schema").Supplier>;
    updateLastOrder(id: string, body: {
        orderDate: string;
    }): Promise<import("../../schemas/supplier.schema").Supplier>;
    incrementProductsSupplied(id: string, body: {
        count?: number;
    }): Promise<import("../../schemas/supplier.schema").Supplier>;
}
