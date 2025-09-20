export declare class UploadsService {
    constructor();
    uploadImage(file: Express.Multer.File, folder?: string): Promise<string>;
    uploadDocument(file: Express.Multer.File, folder?: string): Promise<string>;
    deleteFile(publicId: string): Promise<void>;
}
