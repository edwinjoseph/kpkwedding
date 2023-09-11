import { APIEvent, redirect } from 'solid-start';
import supabase from '@lib/supabase/server';
import setCookieHeaders from '@utils/set-cookie-headers';

export async function GET({ request }: APIEvent) {
    const { origin, searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash');
    const email = searchParams.get('email');

    if (token_hash && email) {
        const { data, error } = await supabase(request).auth.verifyOtp({ token_hash, type: 'email' });
        const cookieHeaders = setCookieHeaders(data.session)

        if (cookieHeaders && !error) {
            return redirect(new URL(`/admin`, origin).toString(), {
                headers: cookieHeaders
            });
        }
    }

    return redirect(new URL(`/login`, origin).toString())
}