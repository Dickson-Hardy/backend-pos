"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackUtils = void 0;
class PackUtils {
    static calculatePackInventory(totalUnits, packVariants) {
        const sortedVariants = packVariants
            .filter(v => v.isActive)
            .sort((a, b) => b.packSize - a.packSize);
        let remainingUnits = totalUnits;
        const packBreakdown = [];
        let totalValue = 0;
        for (const variant of sortedVariants) {
            const availablePacks = Math.floor(remainingUnits / variant.packSize);
            if (availablePacks > 0) {
                packBreakdown.push({ variant, availablePacks });
                const unitsUsed = availablePacks * variant.packSize;
                remainingUnits -= unitsUsed;
                totalValue += availablePacks * variant.packPrice;
            }
        }
        const highestUnitPrice = Math.max(...sortedVariants.map(v => v.unitPrice), 0);
        totalValue += remainingUnits * highestUnitPrice;
        return {
            packBreakdown,
            looseUnits: remainingUnits,
            totalValue
        };
    }
    static getAvailablePacks(totalUnits, packSize) {
        return Math.floor(totalUnits / packSize);
    }
    static getLooseUnits(totalUnits, packSize) {
        return totalUnits % packSize;
    }
    static formatInventoryDisplay(totalUnits, packVariants) {
        if (!packVariants || packVariants.length === 0) {
            return `${totalUnits} units`;
        }
        const breakdown = this.calculatePackInventory(totalUnits, packVariants);
        const parts = [];
        breakdown.packBreakdown.forEach(({ variant, availablePacks }) => {
            const name = variant.name || `${variant.packSize}-pack`;
            parts.push(`${availablePacks} ${name}${availablePacks !== 1 ? 's' : ''}`);
        });
        if (breakdown.looseUnits > 0) {
            parts.push(`${breakdown.looseUnits} unit${breakdown.looseUnits !== 1 ? 's' : ''}`);
        }
        return parts.length > 0 ? parts.join(' + ') : '0 units';
    }
    static validatePackSale(packVariant, packQuantity, availableUnits) {
        if (!packVariant.isActive) {
            return { isValid: false, error: 'Pack variant is not active' };
        }
        const requiredUnits = packQuantity * packVariant.packSize;
        if (requiredUnits > availableUnits) {
            return {
                isValid: false,
                error: `Insufficient stock. Need ${requiredUnits} units, but only ${availableUnits} available`
            };
        }
        return { isValid: true };
    }
    static calculateOptimalPacking(targetUnits, packVariants) {
        const activeVariants = packVariants
            .filter(v => v.isActive)
            .sort((a, b) => b.packSize - a.packSize);
        const result = [];
        let remainingUnits = targetUnits;
        for (const variant of activeVariants) {
            const packCount = Math.floor(remainingUnits / variant.packSize);
            if (packCount > 0) {
                result.push({ variant, quantity: packCount });
                remainingUnits -= packCount * variant.packSize;
            }
        }
        return result;
    }
}
exports.PackUtils = PackUtils;
//# sourceMappingURL=pack-utils.js.map