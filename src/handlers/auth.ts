import getHost from '@utils/get-host';
import { Session } from '@supabase/supabase-js';
import { ErrorResponse } from './types';

export const getSession = async (cookies?: string): Promise<ErrorResponse<Session>> => {
    const headers: HeadersInit = [
        ['Content-type', 'application/json'],
    ]

    if (cookies) {
        headers.push(['Cookie', cookies]);
    }

    const response = await fetch(new URL('/api/auth/session', getHost()).toString(), { headers });

    return response.json();
}