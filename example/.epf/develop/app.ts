import Fastify from "fastify";

import module1Entries from "./module1/entrypoint.ts"  
import module2Entries from "./module2/entrypoint.ts"  

const fastify = Fastify({ 
    maxParamLength : 1000,
    logger: {  
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        }
    }  
});

// Register the fastify-raw-body plugin
fastify.register(require('fastify-raw-body'), {
  field: 'rawBody',
  encoding: 'utf8',
});

fastify.register(module1Entries, { prefix: "api" });
fastify.register(module2Entries, { prefix: "api" });

fastify.listen({ port: 3000, host : "::" }).then((address) => {
    // init in entrypoint
});