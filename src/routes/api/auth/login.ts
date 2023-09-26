import { APIEvent, json } from "solid-start";
import supabase from '@lib/supabase/server';
import { ErrorCodes, respondWithAPIError } from '@utils/error-codes';

export async function POST({ request }: APIEvent) {
    const body = await new Response(request.body).json();

    const { error } = await supabase(request).auth.signInWithOtp({
        email: body.email,
        options: {
            shouldCreateUser: false
        }
    });

    if (error) {
        console.error(error);
        return respondWithAPIError(ErrorCodes.AUTH_UNABLE_TO_LOGIN);
    }

    return json({ ok: true })
}