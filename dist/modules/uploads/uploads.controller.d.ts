import { UploadsService } from "./uploads.service";
export declare class UploadsController {
    private uploadsService;
    constructor(uploadsService: UploadsService);
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
    }>;
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
    }>;
}
