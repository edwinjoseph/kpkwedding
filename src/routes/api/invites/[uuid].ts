import { APIEvent, json } from 'solid-start';
import supabase from '@lib/supabase/server';
import { updateInvite } from '@lib/supabase/invites';
import APIError from '@errors/APIError';
import { ErrorCodes, respondWithAPIError } from '@utils/error-codes';

export const PATCH = async ({ request, params }: APIEvent) => {
    const uuid = params.uuid;
    const body = await new Response(request.body).json();

    try {
        await updateInvite(supabase(request), { id: uuid, users: body.users });
        return json({
            data: { ok: true }
        });
    } catch (err: any) {
        if (err instanceof APIError) {
            return respondWithAPIError(err.code);
        }

        console.error(err);
        return respondWithAPIError(ErrorCodes.UNKNOWN);
    }
}
