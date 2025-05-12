import sgMail from "@sendgrid/mail";
import client from "@sendgrid/client";

import { env } from "../config";


let _initialized = false;

function ensureClient() {
    if (!_initialized) {
        const key = env("SENDGRID_API_KEY");

        if (!key) {
            throw new Error("sendgrid API key is missing or invalid. Please check your environment variables.");
        }

        client.setApiKey(key);
        sgMail.setClient(client);
        _initialized = true;
    }
}

export async function addContact(contact: {
    email: string,
    displayName?: string
}) {
    ensureClient();
    await client.request({
        url: "/v3/marketing/contacts",
        method: "PUT",
        body: {
            //list_ids: ['string'],
            contacts:
                [{
                    email: contact.email,
                    first_name: contact.displayName,
                }]
        }
    })
}

export async function removeContatct(email: string) {
    ensureClient();
    const [res, body] = await client.request({
        url: "/v3/marketing/contacts/search/emails",
        method: "POST",
        body: { emails: [email] }
    });
    if (res.statusCode !== 200)
        return; //throw new Error();

    const userId = body.result[email].contact.id;

    await client.request({
        url: "/v3/marketing/contacts",
        method: "DELETE",
        qs: {
            ids: userId,
            delete_all_contacts: false
        }
    })
}

export async function sendMail(msg: {
    templateId: string,
    personalizations?: sgMail.MailDataRequired["personalizations"]
}) {
    ensureClient();
    return await sgMail.send({
        ...msg,
        from: env("SENDGRID_DEFAULT_SENDER")
    })
}