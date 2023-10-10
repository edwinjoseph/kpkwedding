import { SelectInvite, TableInvite, TableResponse, TableUser } from '@lib/supabase/invites';
import { User } from '@supabase/supabase-js';

type PartialKeys<T, K extends keyof T> = {
    [P in Exclude<keyof T, K>]: T[P];
} & {
    [P in K]?: T[P];
};

const buildInvite = (
    invite: Pick<TableInvite, 'id' | 'invited_to' | 'updated_at'>,
    invitedUsers: Array<Omit<PartialKeys<TableUser, 'invite_id'>, 'created_at'>>,
    userResponses: Array<Omit<TableResponse, 'created_at' | 'id'>>,
    authUsers: Array<User>,
): SelectInvite => {
    const users = invitedUsers
        .filter(user => user.invite_id ? user.invite_id === invite.id : true)
        .map(user => {
            const authUser = authUsers.find(authUser => authUser.id === user.user_id);
            const response = userResponses.find(res => res.rsvp_user_id === user.id);
            return {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                is_coming: user.is_coming ?? null,
                user_id: authUser?.id || null,
                email: authUser?.email || null,
                is_vegan: response?.is_vegan ?? null,
                is_vegetarian: response?.is_vegetarian ?? null,
                no_nuts: response?.no_nuts ?? null,
                no_gluten: response?.no_gluten ?? null,
                no_dairy: response?.no_dairy ?? null,
                other: response?.other ?? null,
            }
        });

    return {
        id: invite.id,
        invited_to: invite.invited_to,
        updated_at: invite.updated_at,
        users,
    }
}

export default buildInvite;
