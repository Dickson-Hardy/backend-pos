export declare class ShiftsController {
    findAll(): any[];
    getStats(): {
        totalShifts: number;
        activeShifts: number;
        averageShiftDuration: number;
    };
    start(data: {
        cashierId: string;
        openingBalance: number;
    }): {
        id: string;
        cashierId: string;
        openingBalance: number;
        startTime: Date;
        status: string;
    };
    end(id: string, data: {
        closingBalance: number;
    }): {
        id: string;
        closingBalance: number;
        endTime: Date;
        status: string;
    };
}
