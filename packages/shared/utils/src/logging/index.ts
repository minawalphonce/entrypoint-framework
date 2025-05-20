export type Logger = typeof console;
let logger: Logger;

export function setLogger(instance: Logger) {
    logger = instance;
}

export function initialize(component: string, requestId: string) {
    logger = console as any;
}


export const error = (...args: any[]) => logger?.error?.call(logger, ...args);
export const warn = (...args: any[]) => logger?.warn?.call(logger, ...args);
export const info = (...args: any[]) => logger?.info?.call(logger, ...args);
export const debug = (...args: any[]) => logger?.debug?.call(logger, ...args);

export * from "./error-to-string";