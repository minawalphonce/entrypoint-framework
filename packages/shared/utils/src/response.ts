
export type PageInfo = {
    pageIndex: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    first: boolean;
    last: boolean;
}

type StatusCode = 'SUCCESS' | 'ERROR';

interface Status {
    code: StatusCode;
    description?: string;
    errors?: { [key: string]: { errorCode: string; errorMessage: string } };
}


interface Response {
    status: Status;
    content?: any[] | any;
    pageInfo?: PageInfo;
}

const createResponse = (
    code: StatusCode,
    description?: string,
    content?: any[] | any,
    pageInfo?: PageInfo,
    errors?: Status["errors"]
): Response => ({
    status: {
        code,
        description,
        errors,
    },
    content,
    pageInfo,
});

export const success = (
    data?: any | null,
    description?: string | null,
    pageInfo?: PageInfo
): Response => createResponse(
    'SUCCESS',
    description || 'Success',
    data,
    pageInfo,
    undefined
);

export const databaseOperationError = (error: string): Response => createResponse(
    'ERROR',
    undefined,
    undefined,
    undefined,
    {
        dbOperationError: {
            errorCode: 'db_operation_error',
            errorMessage: `Database operation error: ${error}`
        }
    }
);

export const validationError = (errors: Status["errors"]): Response => createResponse(
    'ERROR',
    undefined,
    undefined,
    undefined,
    errors
);

export const serverError = (error: string): Response => createResponse(
    "ERROR",
    undefined,
    undefined,
    undefined, {
    serverError: {
        errorCode: "server_error",
        errorMessage: `Internal server error: ${error}`
    }
})

export const customerNotFound = () => createResponse(
    "ERROR",
    undefined,
    undefined,
    undefined, {
    customer: {
        errorCode: "customer_not_found",
        errorMessage: "Customer not found"
    }
});

export const customerIdNotFound = () => createResponse(
    "ERROR",
    undefined,
    undefined,
    undefined, {
    customerId: {
        errorCode: "customerId_not_found",
        errorMessage: "CustomerId not found"
    }
});

export const dataNotFoundError = (error: string): Response => createResponse(
    "ERROR",
    undefined,
    undefined,
    undefined, {
    dataNotFoundError: {
        errorCode: "data_not_found",
        errorMessage: `Requested data not found: ${error}`
    }
});