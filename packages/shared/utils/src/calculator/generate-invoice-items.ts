import { TariffFeeUnit } from "./types";

/**
 * Calculates invoice items based on duration, consumption, tax, and fee configurations.
 * 
 * @param durationMinutes - The duration of the service in minutes
 * @param consumptionInKWH - The electricity consumption in kilowatt-hours
 * @param taxPercent - The tax rate as a decimal (e.g., 0.19 for 19%)
 * @param fees - Array of fee configurations containing:
 *   - name: Display name of the fee
 *   - priority: Order in which fees should be calculated
 *   - unit: Type of fee (kWh, minute, fixed, or percent)
 *   - price: Price per unit
 *   - minUnit?: Minimum units to charge (optional)
 *   - maxUnit?: Maximum units to charge (optional)
 * 
 * @returns An object containing:
 *   - amount: Total amount including tax (rounded to 2 decimal places)
 *   - tax: Tax amount (rounded to 2 decimal places)
 *   - items: Array of calculated invoice items, each containing:
 *     - name: Fee name
 *     - priority: Fee priority
 *     - unit: Fee unit type
 *     - unitPrice: Price per unit
 *     - quantity: Number of units charged
 *     - amount: Total amount for this item
 */
export function generateInvoiceItems(
    durationMinutes: number,
    consumptionInKWH: number,
    taxPercent: number,
    fees: {
        name: string;
        priority: number;
        unit: TariffFeeUnit;
        price: number;
        minUnit?: number;
        maxUnit?: number;
    }[]) {
    const sortedFees = [...fees].sort((a, b) => a.priority - b.priority);
    let totalAmount = 0;
    let remainingKwh = consumptionInKWH;
    let remainingMinutes = durationMinutes;
    const items = [];

    for (const fee of sortedFees) {
        const item = {
            name: fee.name,
            priority: fee.priority,
            unit: fee.unit,
            unitPrice: fee.price,
            quantity: 1,
            amount: 0
        };
        switch (fee.unit) {
            case TariffFeeUnit.kwh: {
                let applicableKwh = remainingKwh;

                // Apply min/max constraints for kWh
                if (fee.minUnit) {
                    applicableKwh = Math.max(applicableKwh, fee.minUnit);
                }
                if (fee.maxUnit) {
                    applicableKwh = Math.min(applicableKwh, fee.maxUnit);
                }

                totalAmount += applicableKwh * fee.price;
                remainingKwh -= applicableKwh;
                item.quantity = applicableKwh;
                item.amount = applicableKwh * fee.price;
                break;
            }

            case TariffFeeUnit.minute: {
                let applicableMinutes = remainingMinutes;

                // Apply min/max constraints for minutes
                if (fee.minUnit) {
                    applicableMinutes = Math.max(applicableMinutes, fee.minUnit);
                }
                if (fee.maxUnit) {
                    applicableMinutes = Math.min(applicableMinutes, fee.maxUnit);
                }

                totalAmount += applicableMinutes * fee.price;
                remainingMinutes -= applicableMinutes;
                item.quantity = applicableMinutes;
                item.amount = applicableMinutes * fee.price;
                break;
            }

            case TariffFeeUnit.fixed: {
                totalAmount += fee.price;
                item.amount = fee.price;
                break;
            }

            case TariffFeeUnit.percent: {
                // Percentage fees are calculated based on the current total
                totalAmount += totalAmount * fee.price
                item.amount = totalAmount * fee.price;
                break;
            }
        }
        items.push(item);
    }

    const taxAmount = totalAmount * taxPercent;

    return {
        amount: Number((taxAmount + totalAmount).toFixed(2)),
        tax: Number(taxAmount.toFixed(2)),
        items,
    }
}