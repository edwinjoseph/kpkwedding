import { Session } from '@supabase/supabase-js';

export const AUTH_TOKEN_COOKIE_NAME = 'auth-token';

const addMillisecondsToDate = (date: Date, milliseconds: number): Date => {
    const newDate = new Date(date);
    newDate.setTime(date.getTime() + milliseconds);
    return newDate;
}

const setCookieHeaders = (session: Session | null, expired = false): HeadersInit | null => {
    if (!session && !expired) {
        return null;
    }

    const currentDate = new Date();
    const expiryMilliseconds = !expired ? session!.expires_in * 60 : -1000;
    const cookieValue = !expired ? JSON.stringify(session) : '';
    const cookieExpiry = addMillisecondsToDate(currentDate, expiryMilliseconds).toUTCString();
    const authTokenCookie = `${AUTH_TOKEN_COOKIE_NAME}=${cookieValue}; Expires=${cookieExpiry}; Path=/; SameSite=Lax;`;

    return [
        ['Set-Cookie', authTokenCookie],
    ]
}

export default setCookieHeaders;