import Stripe from 'stripe';

import { env } from "../config"

let stripeClient: Stripe | null = null;
export function ensureClient() {

    console.log("ensure stripeClient",stripeClient);
    if (stripeClient)
        return stripeClient;
    try {
        const stripeKey = env('STRIPE_KEY');

        if (!stripeKey) {
            throw new Error("Stripe API key is missing or invalid. Please check your environment variables.");
        }
        stripeClient = new Stripe(stripeKey, {
            apiVersion: '2023-08-16',
        });

        return stripeClient;
    } catch (error) {
        console.log("ensure errorzz",error);
        throw error;
    }
}
