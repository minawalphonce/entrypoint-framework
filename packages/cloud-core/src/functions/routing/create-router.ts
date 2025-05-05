import {
  FunctionContext,
  HandlerType,
  Adapter,
  Matcher,
  Pipe
} from "@@types";

export interface Handler {
  matcher: Matcher;
  createContext: (adapter: Adapter, ...args: any[]) => FunctionContext;
  funcs: Pipe[];
}

export const createRouter = () => {
  const _handlers: Handler[] = [];

  const add = (handler: Handler) => {
    _handlers.push(handler);
  };

  const run = async (handlerType: HandlerType, adapter?: Adapter, ...args: any[]) => {
    const matchedHandler = _handlers.find((handler) => handler.matcher(handlerType));

    if (!matchedHandler) {
      throw new Error(`No handler found for handler type: ${handlerType}`);
    }

    const context = matchedHandler.createContext(adapter, ...args);

    for (let idx = 0; idx < matchedHandler.funcs.length; idx++) {
      try {
        await matchedHandler.funcs[idx](context);
      } catch (error) {
        await context.error();
      }
    }

    return context.output();
  };

  return {
    add,
    run,
  };
};