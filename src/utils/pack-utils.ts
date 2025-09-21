import type { PackVariant } from "../schemas/pack-variant.schema"

export interface PackInventoryBreakdown {
  packBreakdown: Array<{ variant: PackVariant; availablePacks: number }>
  looseUnits: number
  totalValue: number
}

export class PackUtils {
  /**
   * Calculate pack inventory breakdown from total units
   */
  static calculatePackInventory(totalUnits: number, packVariants: PackVariant[]): PackInventoryBreakdown {
    // Sort pack variants by size (largest first) for optimal packing
    const sortedVariants = packVariants
      .filter(v => v.isActive)
      .sort((a, b) => b.packSize - a.packSize)
    
    let remainingUnits = totalUnits
    const packBreakdown: Array<{ variant: PackVariant; availablePacks: number }> = []
    let totalValue = 0

    // Calculate how many of each pack size can be made
    for (const variant of sortedVariants) {
      const availablePacks = Math.floor(remainingUnits / variant.packSize)
      if (availablePacks > 0) {
        packBreakdown.push({ variant, availablePacks })
        const unitsUsed = availablePacks * variant.packSize
        remainingUnits -= unitsUsed
        totalValue += availablePacks * variant.packPrice
      }
    }

    // Add value of loose units (use highest unit price available)
    const highestUnitPrice = Math.max(...sortedVariants.map(v => v.unitPrice), 0)
    totalValue += remainingUnits * highestUnitPrice

    return {
      packBreakdown,
      looseUnits: remainingUnits,
      totalValue
    }
  }

  /**
   * Get available packs for a specific variant
   */
  static getAvailablePacks(totalUnits: number, packSize: number): number {
    return Math.floor(totalUnits / packSize)
  }

  /**
   * Get loose units after making all possible packs
   */
  static getLooseUnits(totalUnits: number, packSize: number): number {
    return totalUnits % packSize
  }

  /**
   * Format inventory display string
   */
  static formatInventoryDisplay(totalUnits: number, packVariants: PackVariant[]): string {
    if (!packVariants || packVariants.length === 0) {
      return `${totalUnits} units`
    }

    const breakdown = this.calculatePackInventory(totalUnits, packVariants)
    const parts: string[] = []

    breakdown.packBreakdown.forEach(({ variant, availablePacks }) => {
      const name = variant.name || `${variant.packSize}-pack`
      parts.push(`${availablePacks} ${name}${availablePacks !== 1 ? 's' : ''}`)
    })

    if (breakdown.looseUnits > 0) {
      parts.push(`${breakdown.looseUnits} unit${breakdown.looseUnits !== 1 ? 's' : ''}`)
    }

    return parts.length > 0 ? parts.join(' + ') : '0 units'
  }

  /**
   * Validate pack sale request
   */
  static validatePackSale(
    packVariant: PackVariant,
    packQuantity: number,
    availableUnits: number
  ): { isValid: boolean; error?: string } {
    if (!packVariant.isActive) {
      return { isValid: false, error: 'Pack variant is not active' }
    }

    const requiredUnits = packQuantity * packVariant.packSize
    if (requiredUnits > availableUnits) {
      return { 
        isValid: false, 
        error: `Insufficient stock. Need ${requiredUnits} units, but only ${availableUnits} available` 
      }
    }

    return { isValid: true }
  }

  /**
   * Calculate optimal pack distribution for a given quantity
   */
  static calculateOptimalPacking(
    targetUnits: number,
    packVariants: PackVariant[]
  ): Array<{ variant: PackVariant; quantity: number }> {
    const activeVariants = packVariants
      .filter(v => v.isActive)
      .sort((a, b) => b.packSize - a.packSize) // Largest first

    const result: Array<{ variant: PackVariant; quantity: number }> = []
    let remainingUnits = targetUnits

    for (const variant of activeVariants) {
      const packCount = Math.floor(remainingUnits / variant.packSize)
      if (packCount > 0) {
        result.push({ variant, quantity: packCount })
        remainingUnits -= packCount * variant.packSize
      }
    }

    return result
  }
}