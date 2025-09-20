import { UserRole } from "../../../schemas/user.schema";
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    outletId?: string;
    phone?: string;
    avatar?: string;
}
