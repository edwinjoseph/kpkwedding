import { ErrorCodes } from '@utils/error-codes';

class APIError extends Error {
    code: ErrorCodes

    constructor(message: string, code: ErrorCodes) {
        super(message);
        Object.setPrototypeOf(this, APIError.prototype);
        this.code = code;
    }
}

export default APIError;
