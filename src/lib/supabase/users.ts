import { SupabaseClient, Session } from '@supabase/supabase-js';
import { Database } from '@lib/supabase/database.types';
import NotAuthenticatedError from '@errors/NotAuthenticatedError';

export const isAuthenticated = async (supabase: SupabaseClient<Database>, userId?: string): Promise<Session> => {
    const { data } = await supabase.auth.getSession();

    if (data.session === null || (userId && data.session.user.id !== userId)) {
        throw new NotAuthenticatedError()
    }

    return data.session;
}
