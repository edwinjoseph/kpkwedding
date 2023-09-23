import APIError from './APIError';
import { ErrorCodes } from '@utils/error-codes';

class NotAuthenticatedError extends APIError {
    constructor() {
        super('Not Authorised', ErrorCodes.AUTH_NOT_AUTHORISED);
    }
}

export default NotAuthenticatedError;
