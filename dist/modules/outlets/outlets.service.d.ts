import type { Model } from "mongoose";
import { Outlet, type OutletDocument } from "../../schemas/outlet.schema";
import type { CreateOutletDto } from "./dto/create-outlet.dto";
import type { UpdateOutletDto } from "./dto/update-outlet.dto";
export declare class OutletsService {
    private outletModel;
    constructor(outletModel: Model<OutletDocument>);
    create(createOutletDto: CreateOutletDto): Promise<Outlet>;
    findAll(): Promise<Outlet[]>;
    findOne(id: string): Promise<Outlet>;
    update(id: string, updateOutletDto: UpdateOutletDto): Promise<Outlet>;
    remove(id: string): Promise<void>;
}
