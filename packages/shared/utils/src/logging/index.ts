import pino, { Logger, LogFn } from "pino";
import { env } from "../config";

let logger: Logger;

export function setLogger(instance: Logger) {
    logger = instance;
}

export function initialize(component: string, requestId: string) {
    logger = pino({
        level: env("LOG_LEVEL", "info"),
        formatters: {
            bindings: () => {
                return { component, requestId };
            }
        }
    });

}


export const fatal: LogFn = (...args: any[]) => logger?.fatal?.call(logger, ...args);
export const error: LogFn = (...args: any[]) => logger?.error?.call(logger, ...args);
export const warn: LogFn = (...args: any[]) => logger?.warn?.call(logger, ...args);
export const info: LogFn = (...args: any[]) => logger?.info?.call(logger, ...args);
export const debug: LogFn = (...args: any[]) => logger?.debug?.call(logger, ...args);
export const trace: LogFn = (...args: any[]) => logger?.trace?.call(logger, ...args);

export * from "./error-to-string";