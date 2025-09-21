import { SaleType } from "../../../schemas/sale-pack-info.schema";
export declare class CreateSalePackInfoDto {
    saleType: SaleType;
    packVariantId?: string;
    packQuantity?: number;
    unitQuantity?: number;
    effectiveUnitCount: number;
}
