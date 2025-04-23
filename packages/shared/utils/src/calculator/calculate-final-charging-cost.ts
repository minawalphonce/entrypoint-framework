/**
 * Calculates the final cost for a charging session based on duration, consumption and contract terms
 * 
 * @param operatorCDR - The charging data record
 * @param operatorCDR.chargeDuration - Duration of charging in minutes
 * @param operatorCDR.consumption - Energy consumed in kWh
 * 
 * @param contract - The pricing contract terms
 * @param contract.freeMinutes - Number of free minutes included
 * @param contract.freeKwh - Number of free kWh included
 * @param contract.minutePrice - Price per minute after free minutes
 * @param contract.kwhPrice - Price per kWh after free kWh
 * @param contract.sessionPrice - Fixed fee per charging session
 * @param contract.taxPercent - Tax percentage to apply to total
 * 
 * @returns The final price rounded down to nearest integer, including tax
 */
export function calculateFinalChargingCost(
    operatorCDR: {
        chargeDuration: number;
        consumption: number;
    },
    contract: {
        freeMinutes: number;
        freeKwh: number;
        minutePrice: number;
        kwhPrice: number;
        sessionPrice: number;
        taxPercent: number;
    }
) {
    let calculatedTotalCost =
        ((operatorCDR.chargeDuration - contract.freeMinutes) * contract.minutePrice) + //time cost
        ((operatorCDR.consumption - contract.freeKwh) * contract.kwhPrice) + //kwh cost
        (contract.sessionPrice);  //session fee

    calculatedTotalCost = calculatedTotalCost + (calculatedTotalCost * contract.taxPercent / 100); //tax

    return Math.floor(calculatedTotalCost);
}