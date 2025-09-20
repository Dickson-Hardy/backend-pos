import { OutletsService } from "./outlets.service";
import { CreateOutletDto } from "./dto/create-outlet.dto";
import { UpdateOutletDto } from "./dto/update-outlet.dto";
export declare class OutletsController {
    private readonly outletsService;
    constructor(outletsService: OutletsService);
    create(createOutletDto: CreateOutletDto): Promise<import("../../schemas/outlet.schema").Outlet>;
    findAll(): Promise<import("../../schemas/outlet.schema").Outlet[]>;
    findOne(id: string): Promise<import("../../schemas/outlet.schema").Outlet>;
    update(id: string, updateOutletDto: UpdateOutletDto): Promise<import("../../schemas/outlet.schema").Outlet>;
    updatePut(id: string, updateOutletDto: UpdateOutletDto): Promise<import("../../schemas/outlet.schema").Outlet>;
    remove(id: string): Promise<void>;
}
