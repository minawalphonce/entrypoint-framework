
import { AddressInfo } from "node:net";
import querystring from "node:querystring"; 
import jwt from "jsonwebtoken";

import { FastifyInstance } from "fastify";

import {
  HTTPAuth,
  HttpMethod,
  createHttpContext,
  createScheduleContext,
} from "@@cloudecore";

import * as src from "/Users/malphonce/Projects/vcg/entrypoint-framework/example/packages/modules/module1/src/index.ts";

const prefix = "DEV_IDENTITY_";
function buildAuth(headers: { authorization?: any; }) {
  try {
    // Case 1: DEV_IDENTITY_TOKEN
    const devToken = process.env[`${prefix}TOKEN`];
    if (devToken) {
      const claims = jwt.decode(devToken) as Record<string, unknown>;
      return { token: devToken, ...claims };
    }

    // Case 2: DEV_IDENTITY_ variables
    const devIdentityVars = Object.entries(process.env)
      .filter(([key]) => key.startsWith(prefix) && key !== `${prefix}TOKEN`)
      .reduce((acc, [key, value]) => {
        const claimKey = key.replace(prefix, '').toLowerCase();
        acc[claimKey] = value;
        return acc;
      }, {} as Record<string, unknown>);

    if (Object.keys(devIdentityVars).length > 0) {
      return { token: '', ...devIdentityVars };
    }

    // Case 3: Authorization header
    const authHeader = headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const claims = jwt.decode(token) as Record<string, unknown>;
      return { token, ...claims };
    }

    // Case 4: Nothing exists
    return undefined;
  } catch (error) {
    console.error('Error processing identity token:', error);
    return undefined;
  }
}

async function entries(app: FastifyInstance) {
      
    app.route({
      method: "POST" as any,
      url: `/http/identity/token`,
      handler: async function (request, reply) {
        const baseAddress = app.server.address() as AddressInfo;
        const ctx = createHttpContext({
            body: request.rawBody as string,
            headers: request.headers,
            method: request.method as HttpMethod,
            url: `http://${request.hostname}:${baseAddress!.port}/api${routePath}`,
            matchingKey: "/identity/token",
            params: request.params as Record<string, string>,
            rawQueryString : querystring.stringify(request.query),
            host: request.hostname
          }, buildAuth(request.headers));

        try {
          await src["token"](ctx);
          reply
            .headers(ctx.response.headers || {})
            .status(ctx.response.status)
            .send(ctx.response.body);
        }
        catch(e){
          reply.send(e);
        }
      }
  });
      
    app.route({
      method: "DELETE" as any,
      url: `/http/identity/revoke`,
      handler: async function (request, reply) {
        const baseAddress = app.server.address() as AddressInfo;
        const ctx = createHttpContext({
            body: request.rawBody as string,
            headers: request.headers,
            method: request.method as HttpMethod,
            url: `http://${request.hostname}:${baseAddress!.port}/api${routePath}`,
            matchingKey: "/identity/revoke",
            params: request.params as Record<string, string>,
            rawQueryString : querystring.stringify(request.query),
            host: request.hostname
          }, buildAuth(request.headers));

        try {
          await src["revoke"](ctx);
          reply
            .headers(ctx.response.headers || {})
            .status(ctx.response.status)
            .send(ctx.response.body);
        }
        catch(e){
          reply.send(e);
        }
      }
  });
}

export default entries;