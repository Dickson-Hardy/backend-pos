import { ReturnsService } from "./returns.service";
import { CreateReturnDto } from "./dto/create-return.dto";
export declare class ReturnsController {
    private readonly service;
    constructor(service: ReturnsService);
    create(createDto: CreateReturnDto, req: any): Promise<import("../../schemas/return.schema").Return>;
    approve(id: string, req: any): Promise<import("../../schemas/return.schema").Return>;
    reject(id: string, req: any): Promise<import("../../schemas/return.schema").Return>;
    restock(id: string): Promise<import("../../schemas/return.schema").Return>;
    findAll(outletId?: string, status?: string): Promise<import("../../schemas/return.schema").Return[]>;
    getStats(outletId?: string): Promise<any>;
    findOne(id: string): Promise<import("../../schemas/return.schema").Return>;
}
