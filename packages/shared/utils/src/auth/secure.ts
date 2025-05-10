import type { HttpFunctionContext } from "@entrypoint-framework/cloud-core";
import { verify } from "./token";
import { env } from "../config";

export function secure(func: (context: HttpFunctionContext) => Promise<void>) {
    return async function (context: HttpFunctionContext) {
        const auth = context.auth;
        if (!auth) {
            context.output(401, "Unauthorized invalid token or not exists", {
                "content-type": "text/plain"
            });
            return;
        }
        try {
            if (!__DEV__)
                await verify(auth.token, env("IDENTITY_PRIVATE_KEY"));
        } catch (error) {
            context.output(401, error.message, {
                "content-type": "text/plain"
            });
        }

        await func(context);
    }
}