import { APIEvent, redirect } from 'solid-start';
import supabase from '@lib/supabase/server';
import setCookieHeaders from '@utils/set-cookie-headers';

export async function GET({ request }: APIEvent) {
    const { origin } = new URL(request.url);

    await supabase(request).auth.signOut();
    const cookieHeaders = setCookieHeaders(null, true);

    return redirect(new URL('/', origin).toString(), {
        headers: cookieHeaders || undefined
    })
}
