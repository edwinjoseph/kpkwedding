import getHost from '@utils/get-host';
import { json } from 'solid-start';

export enum ErrorCodes {
    AUTH_MISSING_TOKEN_HASH = '0001',
    AUTH_MISSING_OTP_CREDENTIALS = '0002',
    AUTH_UNABLE_TO_AUTHORISE = '0003',
    AUTH_FAILED_TO_SET_HEADERS = '0004',
    AUTH_NOT_AUTHORISED = '0005',
    AUTH_UNABLE_TO_LOGIN = '0006',
    INVITE_USER_NOT_FOUND = '0007',
    INVITE_USER_EXISTS = '0008',
    INVITE_NOT_FOUND = '0009',
    INVITE_MISSING_DATA = '0010',
    INVITE_UNABLE_TO_VERIFY = '0011',
    UNKNOWN = '9999',
}

const HTTPErrorCode = {
    AUTH_MISSING_TOKEN_HASH: '400',
    AUTH_MISSING_OTP_CREDENTIALS: '400',
    AUTH_UNABLE_TO_AUTHORISE: '401',
    AUTH_FAILED_TO_SET_HEADERS: '500',
    AUTH_NOT_AUTHORISED: '401',
    AUTH_UNABLE_TO_LOGIN: '500',
    INVITE_USER_NOT_FOUND: '404',
    INVITE_USER_EXISTS: '403',
    INVITE_NOT_FOUND: '404',
    INVITE_MISSING_DATA: '400',
    INVITE_UNABLE_TO_VERIFY: '401',
    UNKNOWN: '500',
} as const

const getKeyFromEnum = <T extends Record<string, string | number>>(value: string | number, enumerator: T) => {
    return Object.keys(enumerator).find((key) => enumerator[key] === value);
}

const getHTTPCodeFromErrorCode = (code: ErrorCodes): number => {
    const key = getKeyFromEnum(code, ErrorCodes);

    if (!key) {
        return parseInt(HTTPErrorCode.UNKNOWN, 10);
    }

    return parseInt(HTTPErrorCode[key as keyof typeof HTTPErrorCode], 10);
}

export const appendCodeToUrl = (path: string, code: ErrorCodes): string => {
    const url = new URL(path, path.startsWith('http') ? undefined : getHost());

    url.searchParams.set('error', code);

    return url.toString();
}

export const respondWithAPIError = (code: ErrorCodes) => {
    return json({
        error: {
            code,
        }
    }, getHTTPCodeFromErrorCode(code))
}