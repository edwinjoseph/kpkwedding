import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@lib/supabase/database.types';
import NotAuthenticatedError from '@errors/NotAuthenticatedError';

export const isAuthenticated = async (supabase: SupabaseClient<Database>): Promise<void> => {
    const { data } = await supabase.auth.getSession();

    if (data.session === null) {
        throw new NotAuthenticatedError()
    }
}
