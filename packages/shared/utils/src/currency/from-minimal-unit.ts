import { currencies } from "./supported-currencies"

export function fromMinimalUnit(amount: number, currency: string): number {
    if (isNaN(amount) || amount < 0) {
        throw new Error("Invalid amount");
    }
    //=====================================
    const decimals = currencies[currency.toUpperCase() as keyof typeof currencies];
    if (!decimals) {
        throw new Error("Unsupported currency");
    }
    //=======================================
    return amount / decimals;
}