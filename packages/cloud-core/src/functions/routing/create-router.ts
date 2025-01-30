import {
  FunctionContext,
  HttpFunctionContext,
  HandlerType,
  Adapter,
  Matcher,
  Pipe,
  ScheduleFunctionContext
} from "@@types"
import { createHttpContext } from "./http/create-http-context";
import { createScheduleContext } from "./schedule/create-schedule-context";


export const createRouter = () => {
  const _handlers: { matcher: Matcher; funcs: Pipe[] }[] = [];

  const add = (matcher: Matcher, ...funcs: Pipe[]) => {
    _handlers.push({
      matcher,
      funcs
    });
  };

  const run = async (
    handlerType: HandlerType,
    adapter?: Adapter,
    ...args: any[]
  ) => {
    let context: FunctionContext = null;

    switch (handlerType) {
      case "Http":
        const [httpRequest, auth] = adapter.input(...args);
        context = createHttpContext(httpRequest, auth);
        break;
      case "Schedule":
        const [scheduleRequest] = adapter.input(...args);
        context = createScheduleContext(scheduleRequest);
        break;
      // case "Event":
      //   //TODO: createEventContext
      //   break;
      // case "File":
      //   //TODO: creatFileContext
      //   break;
    }


    // Get first matching handler
    const matchedHandler = _handlers.find((handler) =>
      handler.matcher(context)
    );

    if (!matchedHandler) {
      // No handler found
      await context.notFound();
    }
    else {
      // Execute each pipe in the matched handler
      for (let idx = 0; idx < matchedHandler.funcs.length; idx += 1) {
        try {
          await matchedHandler.funcs[idx](context);
        } catch (error) {
          await context.error();
        }
      }
    }

    if (handlerType === "Http") {
      return adapter.output((context as HttpFunctionContext).response);
    } else if (handlerType === "Schedule") {
      const scheduleContext = context as ScheduleFunctionContext;
      return scheduleContext.output(200, "");
    }
  };

  return {
    add,
    run
  };
};
