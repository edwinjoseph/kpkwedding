import {Session, SupabaseClient, User} from '@supabase/supabase-js';
import {Database} from '@lib/supabase/database.types';
import NotAuthenticatedError from '@errors/NotAuthenticatedError';
import APIError from '@errors/APIError';
import {ErrorCodes} from '@utils/error-codes';

export const isAuthenticated = async (supabase: SupabaseClient<Database>, userId?: string): Promise<Session> => {
    const { data } = await supabase.auth.getSession();

    if (data.session === null || (userId && data.session.user.id !== userId)) {
        throw new NotAuthenticatedError()
    }

    return data.session;
}

export interface GetOrCreateUser {
    email?: string;
    id?: string;
    firstName: string;
    lastName: string;
}

export const getOrCreateUser = async (supabase: SupabaseClient<Database>, values: GetOrCreateUser): Promise<User> => {
    if (!values.email && !values.id) {
        throw new APIError('You must provide either an email or user id.', ErrorCodes.UNKNOWN);
    }

    const usersRes = await supabase.auth.admin.listUsers();

    if (usersRes.error) {
        throw new APIError('Unable to find users', ErrorCodes.UNKNOWN);
    }

    const user = usersRes.data.users.find(user => {
        if (values.email) {
            return user.email === values.email
        }

        return user.id === values.id;
    });

    if (user && user.user_metadata.first_name !== values.firstName && user.user_metadata.last_name !== values.lastName) {
        throw new APIError('User mismatch', ErrorCodes.AUTH_NOT_AUTHORISED);
    }

    if (user) {
        return user;
    }

    const createUserRes = await supabase.auth.admin.createUser({
        email: values.email,
        email_confirm: true,
        user_metadata: {
            first_name: values.firstName,
            last_name: values.lastName,
        }
    });

    if (createUserRes.error) {
        console.error(createUserRes.error);
        throw new APIError('Unable to create user', ErrorCodes.UNKNOWN);
    }

    return createUserRes.data.user;
}