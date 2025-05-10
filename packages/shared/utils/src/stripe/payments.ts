import Stripe from 'stripe';

import { ensureClient } from './client';
import { toMinimalUnit } from "../currency";

/**
 * update payment metadata in Stripe.
 * @param intentId The ID of the payment intent to update.
 * @param metadata The metadata to update.
**/
export async function updatePaymentMetadata(intentId: string, metadata: Record<string, string>) {
    try {
        const client = ensureClient();
        await client.paymentIntents.update(intentId, {
            metadata
        });
    } catch (error) {
        console.error("Error updating payment intent:", error);
        throw error;
    }
};

/**
 * Cancel a payment intent in Stripe.
 * @param id The ID of the payment intent to cancel.
 */
export async function cancelPayment(id: string) {
    try {
        const client = ensureClient();
        await client.paymentIntents.cancel(id);
    } catch (error) {
        throw error;
    }
}

/**
 * Capture a payment in Stripe.
 * @param amount The amount to capture.
 * @param intentId The ID of the payment intent to capture.
 * @returns The captured payment intent.
 */
export async function capturePayment(amount: number, intentId: string, currency: string) {
    if (!amount || !intentId) {
        throw new Error("Missing parameter to capture the amount.");
    }
    const client = ensureClient();
    try {
        const intent = await client.paymentIntents.capture(intentId, {
            amount_to_capture: toMinimalUnit(amount, currency)
        });
        return intent;
    } catch (error) {
        throw "Error capturing payment " + error;
    }
};

type AuthPaymentParams = {
    metadata?: Record<string, string | number>;
    customerPspId: string;
    amount: number;
    currency: string;
    paymentMethodId?: string;
    savePaymentMethod?: boolean;
}

/**
 * Create ephemeral key and payment intent in Stripe.
 * @param paymentData An object containing the payment details.
 * @param paymentData.customerId The ID of the customer in Stripe.
 * @param paymentData.customerPspId The ID of the customer in the PSP.
 * @param paymentData.amount The amount to charge.
 * @param paymentData.currency The currency for the charge.
 * @param paymentData.paymentMethodId The ID of the payment method (optional).
 * @returns An object containing the ephemeral key, payment intent, and other relevant details.
 */
export async function authPayment(paymentData: AuthPaymentParams) {
    try {
        const client = ensureClient();
        // Create ephemeral key
        const ephemeralKey = await client.ephemeralKeys.create(
            { customer: paymentData.customerPspId },
            { apiVersion: '2023-08-16' }
        );

        // Base intent object
        const intentParams: Stripe.PaymentIntentCreateParams = {
            customer: paymentData.customerPspId,
            amount: toMinimalUnit(paymentData.amount, paymentData.currency),
            currency: paymentData.currency,
            capture_method: "manual",
            metadata: paymentData.metadata,
            automatic_payment_methods: { enabled: true, allow_redirects: "never" },
            setup_future_usage: paymentData.savePaymentMethod ? "off_session" : undefined
        };

        // Add payment method if provided
        if (paymentData.paymentMethodId) {
            intentParams.payment_method = paymentData.paymentMethodId;
            intentParams.confirm = true;
        }

        // Create payment intent
        const intent = await client.paymentIntents.create(intentParams);

        // Create data object
        const data = {
            status: intent?.status,
            ephemeralKey: ephemeralKey?.secret,
            intentId: intent?.id,
            clientSecret: intent?.client_secret,
            customerId: intent?.customer,
            amount: intent?.amount,
        };

        return data;
    } catch (error) {
        throw error;
    }
}
