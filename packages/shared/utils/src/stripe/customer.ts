import { ensureClient } from './client';

/**
* Create a payment customer in Stripe.
* @param name The name of the customer.
* @param email The email of the customer.
* @returns The created Stripe customer object.
*/
export async function createPaymentCustomer(name?: string, email?: string, customerId?: string) {
    try {
        console.log("createPaymentCustomerr ");
        const client = ensureClient();
        const stripeCustomer = await client?.customers.create({
            name: name,
            email: email,
            metadata: {
                customerId
            }
        });
        console.log("createPaymentCustomer stripeCustomer",stripeCustomer);
        return stripeCustomer;
    } catch (error) {
        
        console.log("createPaymentCustomer errorz",error)
        throw error;
    }
}

/**
 * Create a customer scret in Stripe.
 * @param customerId The ID of the customer.
 * @returns The created Stripe ephemeralKey for the customer.
 */
export async function createPaymentCustomerSecretKey(customerId: string) {
    try {
        const client = ensureClient();
        const key = await client.ephemeralKeys.create(
            { customer: customerId },
            { apiVersion: '2020-08-27' }
        );
        console.log("createPaymentCustomerSecretKey key",key);
        return key.secret;
    } catch (error) {
        console.log("createPaymentCustomerSecretKey error",error);
        throw error;
    }
}