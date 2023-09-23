import {APIEvent, json} from 'solid-start';
import supabase from '@lib/supabase/server';
import { create, getInvite, getInvites } from '@lib/supabase/invites';
import { ErrorCodes, respondWithAPIError } from '@utils/error-codes';
import APIError from '@errors/APIError';

export const POST = async ({ request }: APIEvent) => {
    const body = await new Response(request.body).json();

    try {
        const inviteId = await create(supabase(request), body);
        return json({ inviteId: inviteId });
    } catch (err: any) {
        if (err instanceof APIError) {
            return respondWithAPIError(err.code);
        }

        return respondWithAPIError(ErrorCodes.UNKNOWN);
    }
}

export const GET = async ({ request }: APIEvent) => {
    const { searchParams } = new URL(request.url)
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');

    try {
        if (firstName && lastName) {
            const invite = await getInvite(supabase(request), {
                firstName,
                lastName,
            });

            return json(invite)
        }

        const invites = await getInvites(supabase(request));

        return json(invites)
    } catch (err: any) {
        if (err instanceof APIError) {
            return respondWithAPIError(err.code);
        }

        return respondWithAPIError(ErrorCodes.UNKNOWN);
    }
}