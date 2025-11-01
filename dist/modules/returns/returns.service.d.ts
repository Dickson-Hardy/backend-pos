import { Model } from "mongoose";
import { Return, ReturnDocument } from "../../schemas/return.schema";
import { ProductDocument } from "../../schemas/product.schema";
import { WebsocketGateway } from "../websocket/websocket.gateway";
import { CreateReturnDto } from "./dto/create-return.dto";
export declare class ReturnsService {
    private returnModel;
    private productModel;
    private websocketGateway;
    constructor(returnModel: Model<ReturnDocument>, productModel: Model<ProductDocument>, websocketGateway: WebsocketGateway);
    create(createDto: CreateReturnDto, userId: string): Promise<Return>;
    approve(id: string, userId: string): Promise<Return>;
    reject(id: string, userId: string): Promise<Return>;
    restockInventory(id: string): Promise<Return>;
    findAll(outletId?: string, status?: string): Promise<Return[]>;
    findOne(id: string): Promise<Return>;
    getReturnStats(outletId?: string): Promise<any>;
    private generateReturnNumber;
}
