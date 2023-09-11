import { createServerClient, isBrowser } from '@supabase/ssr';
import Cookies from 'universal-cookie';
import {AUTH_TOKEN_COOKIE_NAME} from '@utils/set-cookie-headers';

const initialiseSBServer = (req: Request) => {
    if (isBrowser()) {
        throw new Error('Trying to initialise SB Server on the Client.');
    }

    const cookies = new Cookies(req.headers.get('Cookie'));

    return createServerClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
        cookies,
        auth: {
            flowType: 'pkce',
            storageKey: AUTH_TOKEN_COOKIE_NAME,
        }
    });
}

export default initialiseSBServer;
