import { APIEvent } from 'solid-start';
import supabase from '@lib/supabase/server';
import { ErrorCodes, respondWithAPIError } from '@utils/error-codes';

const requiresAuth = (callback: (event: APIEvent) => Response | Promise<Response>) => {
    return async (event: APIEvent) => {
        const { data } = await supabase(event.request).auth.getSession();

        if (data.session === null) {
            return respondWithAPIError(ErrorCodes.AUTH_NOT_AUTHORISED);
        }

        return callback(event);
    }
}

export default requiresAuth;
