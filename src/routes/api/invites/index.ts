import { APIEvent, json } from 'solid-start';
import supabase from '@lib/supabase/server';
import { create, getInvite, getInvites } from '@lib/supabase/invites';
import { ErrorCodes, respondWithAPIError } from '@utils/error-codes';
import APIError from '@errors/APIError';

export const POST = async ({ request }: APIEvent) => {
    const body = await new Response(request.body).json();

    try {
        const inviteId = await create(supabase(request), body);
        return json({
            data: { inviteId: inviteId }
        });
    } catch (err: unknown) {
        if (err instanceof APIError) {
            return respondWithAPIError(err.code);
        }

        console.error(err);
        return respondWithAPIError(ErrorCodes.UNKNOWN);
    }
}

export const GET = async ({ request }: APIEvent) => {
    const { searchParams } = new URL(request.url);
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');
    const userId = searchParams.get('userId');

    try {
        if (firstName && lastName || userId) {
            const invite = await getInvite(supabase(request), {
                firstName,
                lastName,
                userId,
            });

            return json({ data: invite })
        }

        const invites = await getInvites(supabase(request));

        return json({
            data: invites,
        })
    } catch (err: unknown) {
        if (err instanceof APIError) {
            return respondWithAPIError(err.code);
        }

        console.error(err);
        return respondWithAPIError(ErrorCodes.UNKNOWN);
    }
}
