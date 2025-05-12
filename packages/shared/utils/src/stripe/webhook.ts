import Stripe from "stripe";

import { ensureClient } from "./client";

import { env } from "../config";

export function readWebhookSignature(payload: string, signature?: string) {
    const stripeSecret = env('STRIPE_WEBHOOK_SECRET');
    const client = ensureClient();

    if (stripeSecret) {
        const event = client.webhooks.constructEvent(payload, signature, stripeSecret);
        return event;
    }

    return JSON.parse(payload) as Stripe.Event;
}