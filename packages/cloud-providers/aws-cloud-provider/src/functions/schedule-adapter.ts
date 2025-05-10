import { Context, ScheduledEvent } from "aws-lambda";

import { Adapter, ScheduleRequest } from "@@types";

export const scheduleAdapter: Adapter = {
    input: (...args) => {
        const [event, ctx] = args as [ScheduledEvent, Context];
        const ndx = event.resources[0].lastIndexOf("/");
        const name = event.resources[0].substring(ndx + 1, event.resources[0].length);
        let request: ScheduleRequest = {
            name,
            requestId: ctx.awsRequestId,
        };
        return [request];
    },
    output: (result) => {
        return {
            statusCode: result.status,
            body: result.body,
        };
    },
};