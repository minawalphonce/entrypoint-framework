import { FunctionContext, HttpMethod, HttpFunctionContext } from "@@types"

export const httpMatcher = (method: HttpMethod, urlPattern: string) =>
    (context: FunctionContext) => {
        // Is HTTP Context present
        if (context.type != "Http")
            return false;

        const httpContext = context as HttpFunctionContext;

        // Does Method match
        const { method: requestMethod, matchingKey } = httpContext.request;
        if (method.toLowerCase() !== requestMethod.toLowerCase()) {
            return false;
        }

        return urlPattern.toLowerCase() === matchingKey.toLowerCase();
    };