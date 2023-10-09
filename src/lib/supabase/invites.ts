import {PostgrestSingleResponse, SupabaseClient} from '@supabase/supabase-js';
import camelCase from 'lodash/camelCase';
import deepMapKeys from '@utils/deep-map-keys';
import {Database} from '@lib/supabase/database.types';
import {getOrCreateUser, isAuthenticated} from '@lib/supabase/users';
import APIError from '@errors/APIError';
import {ErrorCodes} from '@utils/error-codes';
import {findByClientUserName} from '@lib/supabase/utils/findByClientUser';

export enum InvitedTo {
    CEREMONY = 'CEREMONY',
    RECEPTION = 'RECEPTION'
}

export type TableResponse = Database['rsvp']['Tables']['responses']['Row'];
export type TableUser = Database['rsvp']['Tables']['users']['Row'];
export type TableInvite = Database['rsvp']['Tables']['invites']['Row'];

export type SelectInvite = Pick<TableInvite, 'id' | 'invited_to'> & {
    users: Array<Omit<TableUser, 'created_at'> & {
        responses: [Omit<TableResponse, 'created_at' | 'id'>]
    }>
}

export interface ReturnDBUser {
    id: string;
    first_name: string;
    last_name: string;
    is_coming: boolean | null;
    user_id: string | null;
    is_vegan: boolean | null;
    is_vegetarian: boolean | null;
    no_gluten: boolean | null;
    no_nuts: boolean | null;
    no_dairy: boolean | null;
    other: string | null;
}

interface ReturnDBInvite {
    id: string,
    invited_to: string;
    users: Array<ReturnDBUser & { email?: string }>
}

export interface ClientUser {
    firstName: string;
    lastName: string;
    id?: string;
    email?: string;
    isComing?: boolean;
    isVegan?: boolean;
    isVegetarian?: boolean;
    noGlutan?: boolean;
    noNuts?: boolean;
    noDairy?: boolean;
    other?: string;
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

export interface VerifyInvite {
    firstName: string;
    lastName: string;
    email: string;
}

export interface UpdateInvite {
    id: string,
    users: Array<Required<ClientUser>>
}

export interface UpdateTable<Row = Record<string, any>> {
    rows: Array<Row>
}

const convertToClientInvite = (invite: SelectInvite): ClientInvite => {
    const clonedInvite: ReturnDBInvite = {
        ...invite,
        users: invite.users.map(({ responses, ...user }) => ({
            ...user,
            ...responses[0]
        }))
    }

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
        .returns<Array<SelectInvite>>()

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

    if (user.data.user_id) {
        await isAuthenticated(supabase, user.data.user_id!);
    }

    const inviteID = user.data.invite_id;

    const invite = await supabase.schema('rsvp')
        .from('invites')
        .select(`
            id,
            invited_to,
            users (
                id,
                first_name,
                last_name,
                is_coming,
                user_id,
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
        .eq('id', inviteID)
        .order('created_at', { foreignTable: 'users.responses', ascending: false })
        .limit(1, { foreignTable: 'users.responses' })
        .limit(1)
        .returns<Array<SelectInvite>>()
        .single();

    if (invite.error) {
        throw new APIError(invite.error.message, ErrorCodes.UNKNOWN);
    }

    const users = invite.data.users.sort((a, b) => {
        if (a.first_name === user?.data!.first_name && a.last_name === user?.data!.last_name) {
            return -1;
        }

        if (b.first_name === user?.data!.first_name && b.last_name === user?.data!.last_name) {
            return 1;
        }

        return 0;
    })

    return convertToClientInvite({
        ...invite.data,
        users
    });
}

export const verifyInvite = async (supabase: SupabaseClient<Database>, values: VerifyInvite): Promise<true> => {
    const user = await supabase.schema('rsvp')
        .from('users')
        .select('*')
        .eq('first_name', values.firstName)
        .eq('last_name', values.lastName)
        .limit(1)
        .single();

    if (user.error && user.error?.code !== 'PGRST116') {
        throw new APIError(user.error.message, ErrorCodes.UNKNOWN);
    }

    if (!user || !user.data) {
        throw new APIError('Unable to find user with invite', ErrorCodes.INVITE_USER_NOT_FOUND);
    }

    if (!user.data.user_id) {
        return true;
    }

    const authUser = await supabase.auth.admin.getUserById(user.data.user_id);

    if (authUser.data.user?.email !== values.email) {
        throw new APIError('Failed to verify invite with details provided', ErrorCodes.INVITE_UNABLE_TO_VERIFY);
    }

    return true;
}

export const updateInvite = async (supabase: SupabaseClient<Database>, values: UpdateInvite): Promise<string> => {
    const usersRes = await supabase.schema('rsvp')
        .from('users')
        .select('id, first_name, last_name, user_id, is_coming')
        .eq('invite_id', values.id);

    if (usersRes.error) {
        throw new APIError('Unable to find invite', ErrorCodes.INVITE_NOT_FOUND)
    }

    const userMismatch = usersRes.data.some(dbUser => !values.users.find(findByClientUserName(dbUser)));

    if (userMismatch) {
        throw new APIError('Unable to associate user to invite', ErrorCodes.INVITE_USER_NOT_FOUND);
    }

    let users = [];
    let authFailed = false;

    for (let dbUser of usersRes.data) {
        const user = values.users.find(findByClientUserName(dbUser))!;
        let user_id = dbUser.user_id;

        if (!user_id) {
            const userData = await getOrCreateUser(supabase, { email: user.email, firstName: dbUser.first_name, lastName: dbUser.last_name });
            user_id = userData.id;
        } else {
            const session = await isAuthenticated(supabase);
            authFailed = dbUser.user_id !== session.user.id;
        }

        users.push({
            id: dbUser.id,
            first_name: dbUser.first_name,
            last_name: dbUser.first_name,
            email: user.email,
            user_id,
            is_coming: user.isComing,
            is_vegan: user.isVegan,
            is_vegetarian: user.isVegetarian,
            no_gluten: user.noGlutan,
            no_nuts: user.noNuts,
            no_dairy: user.noDairy,
            other: user.other || null
        });
    }

    if (authFailed) {
        throw new APIError('Not authorised to update this invite', ErrorCodes.AUTH_NOT_AUTHORISED);
    }

    let responseIds = [];
    let userIds = []

    try {
        for (let user of users) {
            const updateRespRes = await supabase.schema('rsvp')
                .from('responses')
                .insert({
                    is_vegan: user.is_vegan,
                    is_vegetarian: user.is_vegetarian,
                    no_dairy: user.no_dairy,
                    no_gluten: user.no_gluten,
                    no_nuts: user.no_nuts,
                    other: user.other,
                    rsvp_user_id: user.id,
                })
                .select()
                .limit(1)
                .single();

            if (updateRespRes.error) {
                console.error(updateRespRes.error);
                throw new APIError(`Failed to update response for ${values.id}`, ErrorCodes.UNKNOWN);
            }

            responseIds.push(updateRespRes.data.id);

            const updateUserRes = await supabase.schema('rsvp')
                .from('users')
                .update({
                    user_id: user.user_id,
                    is_coming: user.is_coming,
                })
                .eq('id', user.id);

            if (updateUserRes.error) {
                console.error(updateUserRes.error);
                throw new APIError(`Failed to update response for ${values.id}`, ErrorCodes.UNKNOWN);
            }

            userIds.push(user.id);
        }

        await supabase.schema('rsvp')
            .from('invites')
            .update({
                updated_at: new Date().toISOString(),
            })
            .eq('id', values.id)
    } catch (error) {
        if (responseIds.length) {
            for (const id of responseIds) {
                await supabase.schema('rsvp')
                    .from('responses')
                    .delete()
                    .eq('id', id);
            }
        }

        if (userIds.length) {
            for (const id of userIds) {
                const user = usersRes.data.find(dbUser => dbUser.id === id)!;
                await supabase.schema('rsvp')
                    .from('users')
                    .update({
                        user_id: user.user_id,
                        is_coming: user.is_coming,
                    })
                    .eq('id', id);
            }
        }

        if (error instanceof APIError) {
            throw error;
        }

        console.error(error);
        throw new APIError('Unknown error', ErrorCodes.UNKNOWN);
    }
    
    return values.id;
}