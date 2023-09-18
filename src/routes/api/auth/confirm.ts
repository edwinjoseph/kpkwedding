import { APIEvent, redirect, json } from 'solid-start';
import supabase from '@lib/supabase/server';
import setCookieHeaders from '@utils/set-cookie-headers';
import getHost from '@utils/get-host';

export async function GET({ request }: APIEvent) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash');

    if (!token_hash) {
        return redirect(new URL(`/login?error=0001`, getHost()).toString());
    }

    const { data, error } = await supabase(request).auth.verifyOtp({ token_hash, type: 'email' });

    if (error) {
        return redirect(new URL(`/login?error=0003`, getHost()).toString());
    }

    const cookieHeaders = setCookieHeaders(data.session)

    if (!cookieHeaders) {
        return redirect(new URL(`/login?error=0004`, getHost()).toString());
    }

    return redirect(new URL(`/admin`, getHost()).toString(), {
        headers: cookieHeaders
    });
}

export async function POST({ request }: APIEvent) {
    const body = await new Response(request.body).json();

    if (!body.email && !body.code) {
        return json({
            error: {
                code: '0002'
            }
        }, 401)
    }

    const { data, error } = await supabase(request).auth.verifyOtp({
        email: body.email,
        token: body.code,
        type: 'email'
    });

    if (error) {
        return json({
            error: {
                code: '0003'
            }
        }, 401)
    }

    const cookieHeaders = setCookieHeaders(data.session);

    if (!cookieHeaders) {
        return json({
            error: {
                code: '0004'
            }
        }, 401)
    }

    return json({ ok: true }, {
        headers: [
            ...cookieHeaders,
            ['Location', new URL('/admin', getHost()).toString()]
        ]
    });
}