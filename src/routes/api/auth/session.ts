import { APIEvent, json } from 'solid-start';
import supabase from '@lib/supabase/server';
import { isAuthenticated } from '@lib/supabase/users';
import APIError from '@errors/APIError';
import { ErrorCodes, respondWithAPIError } from '@utils/error-codes';

export async function GET({ request }: APIEvent) {
    try {
        const session = await isAuthenticated(supabase(request));
        return json(session);
    } catch (err) {
        if (err instanceof APIError) {
            return respondWithAPIError(err.code);
        }

        return respondWithAPIError(ErrorCodes.UNKNOWN);
    }
}