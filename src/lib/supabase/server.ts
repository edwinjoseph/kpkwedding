import {createServerClient, isBrowser, ServerCookieMethods} from '@supabase/ssr';
import Cookies from 'universal-cookie';
import jwt from 'jsonwebtoken';
import {Database} from '@lib/supabase/database.types';
import {AUTH_TOKEN_COOKIE_NAME} from '@utils/set-cookie-headers';
import APIError from '@errors/APIError';
import {ErrorCodes} from '@utils/error-codes';

const initialiseSBServer = (req: Request) => {
    if (isBrowser()) {
        throw new Error('Trying to initialise SB Server on the Client.');
    }

    const cookies = new Cookies(req.headers.get('Cookie'));

    const cookiesWrapper: ServerCookieMethods = {
        get: async (key) => {
            const value = cookies.get.bind(cookies)(key);

            if (key === AUTH_TOKEN_COOKIE_NAME && value) {
                try {
                    const data = jwt.verify(value, process.env.JWT_SECRET!);
                    return typeof data === 'string' ? data : data.session;
                } catch (error) {
                    throw new APIError('Unable to decode auth token', ErrorCodes.AUTH_UNABLE_TO_AUTHORISE);
                }
            }

            return value;
        },
        set: (key, value, options) => {
            if (key === AUTH_TOKEN_COOKIE_NAME) {
                const token = jwt.sign({ session: JSON.parse(value) }, process.env.JWT_SECRET!, {
                    expiresIn: 86400
                });
                return cookies.set.bind(cookies)(key, token, options);
            }

            return cookies.set.bind(cookies)(key, value, options);
        },
        remove: cookies.remove.bind(cookies),
    }

    return createServerClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
        cookies: cookiesWrapper,
        auth: {
            flowType: 'pkce',
            storageKey: AUTH_TOKEN_COOKIE_NAME,
        },
    });
}

export default initialiseSBServer;
