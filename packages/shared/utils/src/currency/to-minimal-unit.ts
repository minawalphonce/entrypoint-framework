import { currencies } from "./supported-currencies"

export function toMinimalUnit(amount: number, currency: string): number {
    if (isNaN(amount) || amount < 0) {
        throw new Error("Invalid amount");
    }
    //=====================================
    const decimals = currencies[currency.toUpperCase() as keyof typeof currencies];
    if (!decimals) {
        throw new Error("Unsupported currency");
    }
    //=======================================
    return Math.trunc(amount * decimals);
}