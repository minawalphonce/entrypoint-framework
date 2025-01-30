import { ScheduleFunctionContext, ScheduleRequest } from "@@types";


//TODO: add logging for notFound.
export function createScheduleContext(request: ScheduleRequest): ScheduleFunctionContext {
    const result = {
        status: 200,
        body: null as any
    };

    const output = (status: number, body?: any): void => {
        result.status = status;
        result.body = body;
    };

    return {
        type: "Schedule",
        request,

        success: (body?: any) => {
            result.status = 200;
            result.body = body;
        },

        error: (body?: any) => {
            result.status = 500;
            result.body = body;
        },
        notFound: (body?: any) => {
            result.status = 404;
            result.body = body;
        },
        output: output
    }
}