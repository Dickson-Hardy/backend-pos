export declare class CreateOutletDto {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email?: string;
    licenseNumber: string;
    managerId?: string;
    operatingHours?: {
        open: string;
        close: string;
        days: string[];
    };
}
