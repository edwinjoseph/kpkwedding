import getHost from '@utils/get-host';
import { ClientInvite, ClientUser, InvitedTo } from '@lib/supabase/invites';
import { ErrorCodes, respondWithAPIError } from '@utils/error-codes';
import { ErrorResponse } from './types';

interface UserListItem extends ClientUser {
    inviteId: string;
    invitedTo: InvitedTo;
}

export const getInvites = async (cookies: string): Promise<Array<ClientInvite> | ErrorResponse> => {
    const response = await fetch(new URL('/api/invites', getHost()).toString(), {
        headers: [
            ['Content-type', 'application/json'],
            ['Cookie', cookies || '']
        ]
    });

    return response.json();
};

export const getAllInvitees = async (cookies: string): Promise<Array<UserListItem> | ErrorResponse> => {
    const invites = await getInvites(cookies);

    if (!Array.isArray(invites)) {
        return invites;
    }

    return invites.reduce<Array<UserListItem>>((acc, invite) => {
        invite.users.forEach(user => {
            acc.push({
                ...user,
                inviteId: invite.id,
                invitedTo: invite.invitedTo,
            });
        })

        return acc;
    }, []);
};

export const getInvite = async (options: { firstName?: string; lastName?: string; userId?: string; }, cookies?: string): Promise<ClientInvite | ErrorResponse> => {
    const url = new URL('/api/invites', getHost());

    if (options.firstName && options.lastName) {
        url.searchParams.set('firstName', options.firstName);
        url.searchParams.set('lastName', options.lastName);
    }

    if (options.userId) {
        url.searchParams.set('userId', options.userId);
    }

    if (url.searchParams.size === 0) {
        return respondWithAPIError(ErrorCodes.INVITE_USER_NOT_FOUND).json();
    }

    let headers: HeadersInit = [
        ['Content-type', 'application/json']
    ];

    if (cookies) {
        headers.push(['Cookie', cookies]);
    }

    const response = await fetch(url.toString(), {
        headers,
    });
    return response.json();
}
