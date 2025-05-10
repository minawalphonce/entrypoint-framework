import { TariffFeeUnit } from "./types"

/**
 * Calculates the total price based on the given fees, duration, consumption, and tax percentage.
 *
 * @param durationMinutes - The duration in minutes.
 * @param consumptionInKWH - The consumption in kilowatt-hours.
 * @param taxPercent - The tax percentage to be applied to the total amount.
 * @param fees - An array of fee objects, each containing:
 *   - name: The name of the fee.
 *   - priority: The priority of the fee (lower numbers are processed first).
 *   - unit: The unit of the fee (kwh, minute, fixed, percent).
 *   - price: The price per unit of the fee.
 *   - minUnit: (Optional) The minimum unit constraint for the fee.
 *   - maxUnit: (Optional) The maximum unit constraint for the fee.
 * 
 * @returns The total price including tax, rounded to two decimal places.
 */
export function calculateTotalPrice(
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

    // Sort fees by priority
    const sortedFees = [...fees].sort((a, b) => a.priority - b.priority);
    let totalAmount = 0;
    let remainingKwh = consumptionInKWH;
    let remainingMinutes = durationMinutes;

    for (const fee of sortedFees) {
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
                break;
            }

            case TariffFeeUnit.fixed: {
                totalAmount += fee.price;
                break;
            }

            case TariffFeeUnit.percent: {
                // Percentage fees are calculated based on the current total
                totalAmount += totalAmount * fee.price
                break;
            }
        }
    }
    const taxAmount = totalAmount * taxPercent;
    return Number((taxAmount + totalAmount).toFixed(2));
}

// Example usage with mixed priority percentages:
// const exampleFees: Fee[] = [
//     {
//         name: "Base Rate",
//         priority: 1,
//         unit: "kwh",
//         price: 0.30,  // €0.30 per kWh
//         minUnit: 0,
//         maxUnit: 20
//     },
//     {
//         name: "Initial Service Fee",
//         priority: 2,
//         unit: "percent",
//         price: 10     // 10% service fee on base rate
//     },
//     {
//         name: "Higher Rate",
//         priority: 3,
//         unit: "kwh",
//         price: 0.40,  // €0.40 per kWh for remaining kWh
//         minUnit: 20
//     },
//     {
//         name: "Parking Fee",
//         priority: 4,
//         unit: "hour",
//         price: 2.00,  // €2.00 per hour
//     },
//     {
//         name: "Service Fee",
//         priority: 5,
//         unit: "fixed",
//         price: 1.00   // €1.00 fixed fee
//     },
//     {
//         name: "Tax",
//         priority: 6,
//         unit: "percent",
//         price: 19     // 19% VAT on total including previous fees
//     }
// ];

// // Test function to demonstrate the calculation
// function testCalculation(fees: Fee[], kwh: number, minutes: number) {
//     const total = calculateTotalAmount(fees, kwh, minutes);
//     console.log(`Total amount for ${kwh} kWh over ${minutes} minutes: €${total}`);
//     return total;
// }

