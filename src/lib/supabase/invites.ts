import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@lib/supabase/database.types';

enum InvitedTo {
    CEREMONY = 'CEREMONY',
    RECEPTION = 'RECEPTION'
}

interface Person {
    firstName: string;
    lastName: string;
}

export interface CreateNewInvite {
    invitedTo: InvitedTo,
    people: Array<Person>,
}

export const create = async (supabase: SupabaseClient<Database>, values: CreateNewInvite) => {
    const invite = await supabase.schema('rsvp')
        .from('invites')
        .insert({ invited_to: values.invitedTo })
        .select('id');

    if (invite.error) {
        throw invite.error;
    }

    const inviteId = invite.data[0].id;

    const user = await supabase.schema('rsvp')
        .from('users')
        .insert(values.people.map(person => ({
            first_name: person.firstName,
            last_name: person.lastName,
            invite_id: inviteId,
        })));

    if (user.error) {
        await supabase.schema('rsvp')
            .from('invites')
            .delete()
            .eq('id', inviteId);
        throw invite.error;
    }

    return inviteId;
}