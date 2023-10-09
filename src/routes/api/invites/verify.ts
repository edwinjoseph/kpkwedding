import { APIEvent, json } from 'solid-start';
import supabase from '@lib/supabase/server';
import { verifyInvite } from '@lib/supabase/invites';
import APIError from '@errors/APIError';
import { ErrorCodes, respondWithAPIError } from '@utils/error-codes';

export const GET = async ({ request }: APIEvent) => {
    const { searchParams } = new URL(request.url);
    const firstName = searchParams.get('firstName');
    const lastName = searchParams.get('lastName');
    const email = searchParams.get('email');

    try {
        if (!firstName || !lastName || !email) {
            throw new APIError('Failed to verify invite details as email, first name, or last name was not provided', ErrorCodes.INVITE_MISSING_DATA)
        }

        await verifyInvite(supabase(request), { firstName, lastName, email });

        return json({
            data: { ok: true }
        });
    } catch (error: unknown) {
        if (error instanceof APIError) {
            return respondWithAPIError(error.code);
        }

        console.error(error);
        return respondWithAPIError(ErrorCodes.UNKNOWN);
    }
}
