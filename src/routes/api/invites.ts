import { json } from 'solid-start';
import supabase from '@lib/supabase/server';
import { create } from '@lib/supabase/invites';
import { ErrorCodes, respondWithAPIError } from '@utils/error-codes';
import requiresAuth from '@utils/requires-auth';

export const POST = requiresAuth(async ({ request }) => {
    const body = await new Response(request.body).json();

    try {
        const inviteId = await create(supabase(request), body);
        return json({ inviteId: inviteId });
    } catch (err: any) {
        return respondWithAPIError(ErrorCodes.UNKNOWN);
    }
})