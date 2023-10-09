import { ErrorCodes } from '@utils/error-codes';

export type ErrorResponse<T> = {
    data: T;
    error?: null
} | {
    data?: null;
    error: {
        code: ErrorCodes;
    }
}
