import * as yup from 'yup';

type ValidationError = Record<string, { errorCode: string; errorMessage: string }>

export const validate = async <T>(schema: yup.ObjectSchema<T, yup.AnyObject, T, "">, body: any) => {
    return schema.validate(body, { abortEarly: false })
        .then((request) => {
            return {
                isValid: true,
                errors: undefined as ValidationError,
                value: request as T
            };
        })
        .catch((error) => {
            if (error instanceof yup.ValidationError) {
                const errors = error.inner.reduce((acc, error) => {
                    if (error.path) {
                        acc[error.path] = {
                            errorCode: error.type || 'validation_error',
                            errorMessage: error.message
                        };
                    }
                    return acc;
                }, {} as ValidationError);
                return {
                    isValid: false,
                    errors,
                    value: undefined as T
                }
            }
            return {
                '_unknown': {
                    errorCode: 'unexpected_error',
                    errorMessage: 'An unexpected error occurred during validation'
                }
            };
        });
}