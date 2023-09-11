import Cookies from 'universal-cookie';
import { createBrowserClient, isBrowser } from '@supabase/ssr';
import { AUTH_TOKEN_COOKIE_NAME } from '@utils/set-cookie-headers';

const initialiseSBClient = () => {
    if (!isBrowser()) {
        throw new Error('Trying to initialise SB Client on the Server.');
    }

    const cookies = new Cookies(null, { path: '/' });

    return createBrowserClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
        cookies,
        auth: {
            flowType: 'pkce',
            storageKey: AUTH_TOKEN_COOKIE_NAME
        }
    });
}

export default initialiseSBClient;