import { PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import camelCase from 'lodash/camelCase';
import deepMapKeys from '@utils/deep-map-keys';
import { Database } from '@lib/supabase/database.types';
import { isAuthenticated } from '@lib/supabase/users';
import APIError from '@errors/APIError';
import { ErrorCodes } from '@utils/error-codes';

export enum InvitedTo {
    CEREMONY = 'CEREMONY',
    RECEPTION = 'RECEPTION'
}

interface ReturnDBUser {
    first_name: string;
    last_name: string;
    email?: string
    is_coming: boolean;
    responses: Array<{
        is_coming: boolean;
        is_vegan?: boolean;
        is_vegetarian?: boolean;
        no_gluten?: boolean;
        no_nuts?: boolean;
        no_dairy?: boolean;
        other?: string;
    }>
}

interface ReturnDBInvite {
    id: string,
    invited_to: InvitedTo;
    users: Array<ReturnDBUser>
}

export interface ClientUser {
    firstName: string;
    lastName: string;
    email?: string;
    isComing?: boolean;
    response?: {
        isComing: boolean;
        isVegan?: boolean;
        isVegetarian?: boolean;
        noGlutan?: boolean;
        noNuts?: boolean;
        noDairy?: boolean;
        other?: string;
    }
}

export interface ClientInvite {
    id: string,
    invitedTo: InvitedTo,
    users: Array<ClientUser>,
}

export interface GetInvite {
    firstName?: string | null;
    lastName?: string | null;
    userId?: string | null;
}

const convertToClientInvite = (invite: ReturnDBInvite): ClientInvite => {
    const clonedInvite = {
        ...invite,
        users: invite.users.map(({ responses, ...user }) => ({
            ...user,
            response: responses.length ? responses[0] : null
        }))
    };

    return deepMapKeys(clonedInvite, camelCase);
}

export const create = async (supabase: SupabaseClient<Database>, values: ClientInvite): Promise<string> => {
    await isAuthenticated(supabase);

    const user = await supabase.schema('rsvp')
        .from('users')
        .select('*')
        .in('first_name', values.users.map(user => user.firstName))
        .in('last_name', values.users.map(user => user.lastName))
        .limit(1)
        .single();

    if (user.data) {
        throw new APIError('Person already has an invite', ErrorCodes.INVITE_USER_EXISTS);
    }

    const invite = await supabase.schema('rsvp')
        .from('invites')
        .insert({ invited_to: values.invitedTo })
        .select('id')
        .limit(1)
        .single();

    if (invite.error) {
        console.error(invite.error);
        throw new APIError(invite.error.message, ErrorCodes.UNKNOWN);
    }

    const inviteID = invite.data.id;

    const users = await supabase.schema('rsvp')
        .from('users')
        .insert(values.users.map(user => ({
            first_name: user.firstName,
            last_name: user.lastName,
            invite_id: inviteID,
        })));


    if (users.error) {
        await supabase.schema('rsvp')
            .from('invites')
            .delete()
            .eq('id', inviteID);

        console.error(users.error);
        throw new APIError(users.error.message, ErrorCodes.UNKNOWN);
    }

    return inviteID;
}

export const getInvites = async (supabase: SupabaseClient<Database>): Promise<Array<ClientInvite>> => {
    await isAuthenticated(supabase);

    const invites = await supabase.schema('rsvp')
        .from('invites')
        .select(`
            id,
            invited_to,
            users (
                id,
                first_name,
                last_name,
                is_coming,
                responses (
                    is_vegan,
                    is_vegetarian,
                    no_dairy,
                    no_gluten,
                    no_nuts,
                    other
                )
            )
        `)
        .order('created_at', { foreignTable: 'users.responses', ascending: false })
        .limit(1, { foreignTable: 'users.responses' })
        .returns<Array<ReturnDBInvite>>();

    if (invites.error) {
        console.error(invites.error);
        throw new APIError(invites.error.message, ErrorCodes.UNKNOWN);
    }

    return invites.data.map(convertToClientInvite);
}

export const getInvite = async (supabase: SupabaseClient<Database>, values: GetInvite): Promise<ClientInvite> => {
    let user: PostgrestSingleResponse<Database['rsvp']['Tables']['users']['Row']> | undefined;

    if (values.firstName && values.lastName) {
        user = await supabase.schema('rsvp')
            .from('users')
            .select('*')
            .eq('first_name', values.firstName)
            .eq('last_name', values.lastName)
            .limit(1)
            .single();
    }

    if (values.userId) {
        user = await supabase.schema('rsvp')
            .from('users')
            .select('*')
            .eq('user_id', values.userId)
            .limit(1)
            .single();
    }

    if (!user) {
        throw new APIError('Unable to find user with invite', ErrorCodes.INVITE_USER_NOT_FOUND);
    }

    if (user.error && user.error?.code !== 'PGRST116') {
        throw new APIError(user.error.message, ErrorCodes.UNKNOWN);
    }

    if (!user.data) {
        throw new APIError('Unable to find user with invite', ErrorCodes.INVITE_USER_NOT_FOUND);
    }

    if (user.data.is_coming) {
        await isAuthenticated(supabase, user.data.user_id!);
    }

    const inviteID = user.data.invite_id;

    const invite = await supabase.schema('rsvp')
        .from('invites')
        .select(`
            invited_to,
            users (
                first_name,
                last_name,
                is_coming,
                responses (
                    *
                )
            )
        `)
        .eq('id', inviteID)
        .order('created_at', { foreignTable: 'users.responses', ascending: false })
        .limit(1, { foreignTable: 'users.responses'})
        .limit(1)
        .returns<Array<ReturnDBInvite>>()
        .single();

    if (invite.error) {
        throw new APIError(invite.error.message, ErrorCodes.UNKNOWN);
    }

    const users = invite.data.users.sort((a, b) => {
        if (a.first_name === values.firstName && a.last_name === values.lastName) {
            return -1;
        }

        if (b.first_name === values.firstName && b.last_name === values.firstName) {
            return 1;
        }

        return 0;
    })

    return convertToClientInvite({
        ...invite.data,
        users
    });
}