import getHost from '@utils/get-host';
import { ClientInvite, ClientUser, InvitedTo } from '@lib/supabase/invites';
import { ErrorCodes, respondWithAPIError } from '@utils/error-codes';
import { ErrorResponse } from './types';

interface UserListItem extends ClientUser {
    inviteId: string;
    invitedTo: InvitedTo;
}

export const getInvites = async (cookies: string): Promise<ErrorResponse<Array<ClientInvite>>> => {
    const response = await fetch(new URL('/api/invites', getHost()).toString(), {
        headers: [
            ['Content-type', 'application/json'],
            ['Cookie', cookies || '']
        ]
    });

    return response.json();
};

export const getAllInvitees = async (cookies: string): Promise<ErrorResponse<Array<UserListItem>>> => {
    const invites = await getInvites(cookies);

    if (invites.error) {
        return invites;
    }

    const userList = invites.data.reduce<Array<UserListItem>>((acc, invite) => {
        invite.users.forEach(user => {
            acc.push({
                ...user,
                inviteId: invite.id,
                invitedTo: invite.invitedTo,
            });
        })

        return acc;
    }, []);

    return {
        data: userList
    }
};

export const getInvite = async (options: { firstName?: string; lastName?: string; userId?: string; }, cookies?: string): Promise<ErrorResponse<ClientInvite>> => {
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

export const updateInvite = async (options: { id: string, users: Array<ClientUser> }, cookies?: string): Promise<ErrorResponse<{ ok: true }>> => {
    const url = new URL(`/api/invites/${options.id}`, getHost());

    let headers: HeadersInit = [
        ['Content-type', 'application/json']
    ];

    if (cookies) {
        headers.push(['Cookie', cookies]);
    }

    const response = await fetch(url.toString(), {
        headers,
        method: 'PATCH',
        body: JSON.stringify({
            users: options.users
        })
    });

    return response.json();
}

export const verifyInvite = async (options: { firstName: string, lastName: string; email: string }, cookies?: string): Promise<ErrorResponse<{ ok: true }>> => {
    const url = new URL(`/api/invites/verify`, getHost());

    url.searchParams.append('firstName', options.firstName);
    url.searchParams.append('lastName', options.lastName);
    url.searchParams.append('email', options.email);

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
