import Stripe from "stripe";

import { ensureClient } from "./client";

function mapPaymentMethod(paymentMethod: Stripe.PaymentMethod) {
    switch (paymentMethod.type) {
        case "card":
            return {
                paymentType: paymentMethod.card.wallet
                    ? paymentMethod.card.wallet.type === "apple_pay"
                        ? "ap" : "gp"
                    : "cc" as "cc" | "ap" | "gp",
                id: paymentMethod.id,
                brand: paymentMethod.card?.brand,
                last4Digits: paymentMethod.card?.last4,
                exp_month: paymentMethod.card?.exp_month,
                exp_year: paymentMethod.card?.exp_year,
                wallet: paymentMethod.card?.wallet?.type
            };
        case "klarna":
            return {
                id: paymentMethod.id,
                paymentType: "kl"
            }
        case "paypal":
            return {
                id: paymentMethod.id,
                paymentType: "pp",
                email: paymentMethod.paypal.payer_email,
            }
        // case "swish":
        //     return {
        //         id: paymentMethod.id,
        //         paymentType: "sw",
        //     }

    }
}


/**
 * Get a customer's payment methods from Stripe.
 * @param customerId The ID of the customer in Stripe.
 * @returns A Promise that resolves to an array of payment methods.
 */
export async function getPaymentMethods(customerId: string) {
    try {
        const client = ensureClient();

        const methods = await client.customers.listPaymentMethods(
            customerId
        );
        const paymentList = methods?.data.map(mapPaymentMethod).filter(Boolean);

        return paymentList || [];
    } catch (error) {
        throw error;
    }
}

export async function getPaymentMethodById(customerId: string, paymentMethodId: string) {
    try {
        const client = ensureClient();

        const method = await client.paymentMethods.retrieve(
            paymentMethodId
        );

        return mapPaymentMethod(method);
    } catch (error) {
        throw error;
    }
}