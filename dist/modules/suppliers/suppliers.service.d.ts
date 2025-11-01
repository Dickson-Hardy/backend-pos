import { Model } from "mongoose";
import { Supplier, SupplierDocument } from "../../schemas/supplier.schema";
import { CreateSupplierDto } from "./dto/create-supplier.dto";
import { UpdateSupplierDto } from "./dto/update-supplier.dto";
export declare class SuppliersService {
    private supplierModel;
    constructor(supplierModel: Model<SupplierDocument>);
    create(createSupplierDto: CreateSupplierDto): Promise<Supplier>;
    findAll(outletId?: string, status?: string): Promise<Supplier[]>;
    findOne(id: string): Promise<Supplier>;
    update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier>;
    remove(id: string): Promise<void>;
    updateRating(id: string, rating: number): Promise<Supplier>;
    updateLastOrder(id: string, orderDate: Date): Promise<Supplier>;
    incrementProductsSupplied(id: string, count?: number): Promise<Supplier>;
    getSupplierStats(outletId?: string): Promise<any>;
}
