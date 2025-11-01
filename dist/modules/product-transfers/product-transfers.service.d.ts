import { Model } from "mongoose";
import { ProductTransfer, ProductTransferDocument } from "../../schemas/product-transfer.schema";
import { ProductDocument } from "../../schemas/product.schema";
import { WebsocketGateway } from "../websocket/websocket.gateway";
import { CreateTransferDto } from "./dto/create-transfer.dto";
export declare class ProductTransfersService {
    private transferModel;
    private productModel;
    private websocketGateway;
    constructor(transferModel: Model<ProductTransferDocument>, productModel: Model<ProductDocument>, websocketGateway: WebsocketGateway);
    create(createDto: CreateTransferDto, userId: string): Promise<ProductTransfer>;
    approve(id: string, userId: string): Promise<ProductTransfer>;
    complete(id: string, userId: string): Promise<ProductTransfer>;
    cancel(id: string): Promise<ProductTransfer>;
    findAll(outletId?: string, status?: string): Promise<ProductTransfer[]>;
    findOne(id: string): Promise<ProductTransfer>;
    getStats(outletId?: string): Promise<any>;
    private generateTransferNumber;
}
