import { APIEvent, json, redirect } from 'solid-start';
import supabase from '@lib/supabase/server';
import setCookieHeaders from '@utils/set-cookie-headers';
import getHost from '@utils/get-host';
import { appendCodeToUrl, ErrorCodes, respondWithAPIError } from '@utils/error-codes';

export async function GET({ request }: APIEvent) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash');

    if (!token_hash) {
        return redirect(appendCodeToUrl('/login', ErrorCodes.AUTH_MISSING_TOKEN_HASH));
    }

    const { data, error } = await supabase(request).auth.verifyOtp({ token_hash, type: 'email' });

    if (error) {
        console.error(error);
        return redirect(appendCodeToUrl('/login', ErrorCodes.AUTH_UNABLE_TO_AUTHORISE));
    }

    const cookieHeaders = setCookieHeaders(data.session)

    if (!cookieHeaders) {
        return redirect(appendCodeToUrl('/login', ErrorCodes.AUTH_FAILED_TO_SET_HEADERS));
    }

    return redirect(new URL(`/admin`, getHost()).toString(), {
        headers: cookieHeaders
    });
}

export async function POST({ request }: APIEvent) {
    const body = await new Response(request.body).json();

    if (!body.email && !body.code) {
        return respondWithAPIError(ErrorCodes.AUTH_MISSING_OTP_CREDENTIALS);
    }

    const { data, error } = await supabase(request).auth.verifyOtp({
        email: body.email,
        token: body.code,
        type: 'email'
    });

    if (error) {
        console.error(error);
        return respondWithAPIError(ErrorCodes.AUTH_UNABLE_TO_AUTHORISE);
    }

    const cookieHeaders = setCookieHeaders(data.session);

    if (!cookieHeaders) {
        return respondWithAPIError(ErrorCodes.AUTH_FAILED_TO_SET_HEADERS);
    }

    return json({ ok: true }, {
        headers: [
            ...cookieHeaders,
            ['Location', new URL('/admin', getHost()).toString()]
        ]
    });
}