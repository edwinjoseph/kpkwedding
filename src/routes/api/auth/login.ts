import { json, APIEvent } from "solid-start";
import supabase from '@lib/supabase/server';

export async function POST({ request }: APIEvent) {
    const body = await new Response(request.body).json();

    const { error } = await supabase(request).auth.signInWithOtp({
        email: body.email,
        options: {
            shouldCreateUser: false
        }
    });

    if (error) {
        return json({
            error: {
                code: '9999'
            }
        }, 401);
    }

    return json({ ok: true })
}